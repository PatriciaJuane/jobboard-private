import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const useAuthentication = () => {
  const [session, setSession] = useState(null);


  const getURL = () => {
    let url = process?.env?.PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
  };


  const getSubscription =  async (event, session) => {
    return supabase.auth.onAuthStateChange(event, session);
  };

  // Sign up function
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  // Sign in function
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Reset password function
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}reset-password`,
    });
    return { data, error };
  };


  return { signUp, signIn, signOut, resetPassword, getSubscription };
};

export default useAuthentication;