// src/components/Auth.js
import React, { useState, useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import './Auth.css';  // Import the CSS file

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', or 'resetPassword'

  const navigate = useNavigate();

  const getURL = () => {
    let url = process?.env?.PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
  }
  

  useEffect(() => {
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session && event !== 'PASSWORD_RECOVERY') {
        navigate('/jobboard');
      }
    });
  
    // Cleanup by unsubscribing
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Successful login, redirect to jobboard
        navigate('/jobboard');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Successful signup, redirect to jobboard
        navigate('/jobboard');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL()}reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        // Password reset email sent successfully
        setAuthMode('login');
        alert('Password reset email sent. Please check your inbox.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p>
              Don't have an account?{' '}
              <span onClick={() => setAuthMode('signup')}>Sign up here</span>
            </p>
            <p>
              Forgot password?{' '}
              <span onClick={() => setAuthMode('resetPassword')}>Reset here</span>
            </p>
          </form>
        );
      case 'signup':
        return (
          <form onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <p>
              Already have an account?{' '}
              <span onClick={() => setAuthMode('login')}>Login here</span>
            </p>
          </form>
        );
      case 'resetPassword':
        return (
          <form onSubmit={handleResetPassword}>
            <h2>Reset Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending reset link...' : 'Send Reset Link'}
            </button>
            <p>
              Back to{' '}
              <span onClick={() => setAuthMode('login')}>Login</span>
            </p>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Logo on top of the form */}
        <img src={require('../assets/logo.png')} alt="Company Logo" className="company-logo" />

        {session ? (
          <div>
            <h2>Welcome, {session.user.email}</h2>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setSession(null);
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          renderForm()
        )}
      </div>
    </div>
  );
};

export default Auth;
