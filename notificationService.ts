// utils/notifications.ts
import { supabase } from '@/supabaseClient';

export async function sendSpaceNotification(
  spaceId: string,
  subject: string,
  message: string
) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Not authenticated');
    
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('test2', {
      body: {
        spaceId,
        senderId: user.id,
        subject,
        message,
      },
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
}