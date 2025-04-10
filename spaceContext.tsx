import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // Adjust import path as needed

// Define types
interface Space {
  id: string;
  name: string;
  code: string;
}

interface SpaceContextType {
  currentSpace: Space | null;
  loading: boolean;
  refreshSpace: () => void;
}

// Create the context with a default value that matches our type
const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

// Create a provider component
export function SpaceProvider({ children }: { children: React.ReactNode }) {
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the current space
  const fetchCurrentSpace = async () => {
    try {
      setLoading(true);

      const { data: userSession } = await supabase.auth.getSession();

      if (userSession?.session) {
        // Get the space the user is currently in
        const { data, error } = await supabase
          .from("space_members")
          .select("space_id, spaces(id, name, code)")
          .eq("user_id", userSession.session.user.id)
          .single();

        if (data && data.spaces) {
          setCurrentSpace(data.spaces);
        } else {
          setCurrentSpace(null);
        }
      } else {
        setCurrentSpace(null);
      }
    } catch (error) {
      console.error("Error fetching space:", error);
      setCurrentSpace(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current space on mount and when auth state changes
  useEffect(() => {
    fetchCurrentSpace();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchCurrentSpace();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Function to refresh space data (call after creating/joining spaces)
  const refreshSpace = () => {
    fetchCurrentSpace();
  };

  // Create the context value object
  const contextValue: SpaceContextType = {
    currentSpace,
    loading,
    refreshSpace,
  };

  return (
    <SpaceContext.Provider value={contextValue}>
      {children}
    </SpaceContext.Provider>
  );
}

// Create a hook for easy context use
export function useSpace(): SpaceContextType {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return context;
}
