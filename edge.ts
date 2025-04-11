// supabase/functions/send-space-notification/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import sgMail from 'https://esm.sh/@sendgrid/mail';
serve(async (req)=>{
  try {
    // Log the request for debugging
    console.log('Request received:', req.url);
    // Get request body
    const { spaceId, senderId, subject, message } = await req.json();
    // Log the parsed body
    console.log('Request body:', {
      spaceId,
      senderId,
      subject,
      message
    });
    // Validate required fields
    if (!spaceId) throw new Error('spaceId is required');
    if (!senderId) throw new Error('senderId is required');
    if (!subject) throw new Error('subject is required');
    if (!message) throw new Error('message is required');
    // Initialize Supabase client with service role key
    console.log('Initializing Supabase client');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl) throw new Error('SUPABASE_URL env var is missing');
    if (!supabaseKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var is missing');
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    // Check SendGrid API key
    const sendgridKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendgridKey) throw new Error('SENDGRID_API_KEY env var is missing');
    sgMail.setApiKey(sendgridKey);
    // Get all users in the space except the sender
    console.log('Fetching space members');
    const { data: spaceMembers, error: membersError } = await supabaseAdmin.from('space_members').select('user_id').eq('space_id', spaceId).neq('user_id', senderId);
    if (membersError) {
      console.error('Error fetching space members:', membersError);
      throw membersError;
    }
    console.log(`Found ${spaceMembers.length} members in space`);
    if (spaceMembers.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        recipients: 0,
        message: 'No other members in this space'
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Extract user IDs
    const userIds = spaceMembers.map((member)=>member.user_id);
    console.log('User IDs to notify:', userIds);
    // Get space details for the email
    console.log('Fetching space details');
    const { data: spaceData, error: spaceError } = await supabaseAdmin.from('spaces').select('code').eq('id', spaceId).single();
    if (spaceError) {
      console.error('Error fetching space details:', spaceError);
      throw spaceError;
    }
    const spaceName = spaceData.code || 'your space';
    // Get user emails using auth.users
    console.log('Fetching user emails');
    // Note: Directly querying auth.users might require special permissions
    // Use the admin API to get user details
    const usersPromises = userIds.map((userId)=>supabaseAdmin.auth.admin.getUserById(userId));
    const usersResponses = await Promise.all(usersPromises);
    console.log('User responses received');
    // Filter successful responses and extract emails
    const emails = usersResponses.filter((response)=>response.data && response.data.user).map((response)=>response.data.user.email);
    console.log(`Found ${emails.length} valid email addresses`);
    if (emails.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        recipients: 0,
        message: 'No valid email addresses found'
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    // Get sender info for the email
    console.log('Fetching sender details');
    const { data: senderData, error: senderError } = await supabaseAdmin.auth.admin.getUserById(senderId);
    if (senderError) {
      console.error('Error fetching sender details:', senderError);
      throw senderError;
    }
    const senderEmail = senderData.user.email || 'A member';
    const senderName = senderData.user.user_metadata?.full_name || senderEmail;
    // Create and send email
    console.log('Preparing to send emails');
    // HTML email template with some basic styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Notification from ${spaceName}</h2>
          </div>
          
          <p><strong>From:</strong> ${senderName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          
          <div style="margin: 25px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; border-radius: 3px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div class="footer">
            <p>This is an automated notification from your space app.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    // Create email message
    const msg = {
      to: emails,
      from: {
        email: 'lawrencejunzh@gmail.com',
        name: 'Your App Name'
      },
      subject: `[${spaceName}] ${subject}`,
      text: `${senderName} sent a message: ${message}`,
      html: htmlContent,
      // Optional: Use SendGrid's mail settings
      mail_settings: {
        sandbox_mode: {
          enable: false // Set to true for testing without sending actual emails
        }
      }
    };
    console.log('Sending email via SendGrid');
    try {
      const response = await sgMail.send(msg);
      console.log('SendGrid response status:', response[0].statusCode);
      return new Response(JSON.stringify({
        success: true,
        recipients: emails.length,
        message: `Notification sent to ${emails.length} members`
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (sendError) {
      console.error('SendGrid error:', sendError);
      if (sendError.response) {
        console.error('SendGrid error body:', sendError.response.body);
      }
      throw new Error(`Failed to send emails: ${sendError.message}`);
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
