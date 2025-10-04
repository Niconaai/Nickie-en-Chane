'use client';

import { useEffect, useState } from 'react';

export default function TestEnv() {
  const [supabaseStatus, setSupabaseStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [envVars, setEnvVars] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    ikhokaKey: ''
  });

  useEffect(() => {
    // Set environment variables on client side only
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '❌ Not set',
      ikhokaKey: process.env.IKHOKA_API_KEY ? '✓ Set' : '❌ Not set'
    });

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase.from('families').select('count');
        
        if (error) throw error;
        setSupabaseStatus('connected');
      } catch (error) {
        console.error('Supabase test failed:', error);
        setSupabaseStatus('error');
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">System Status</h1>
      
      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.supabaseUrl || 'Loading...'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.supabaseKey || 'Loading...'}</p>
            <p><strong>IKHOKA_API_KEY:</strong> {envVars.ikhokaKey || 'Loading...'}</p>
          </div>
        </div>

        {/* Supabase Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Supabase Connection</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              supabaseStatus === 'loading' ? 'bg-yellow-500' :
              supabaseStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="capitalize">{supabaseStatus}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/rsvp" className="block text-blue-600 hover:underline">RSVP Page</a>
            <a href="/akkomodasie" className="block text-blue-600 hover:underline">Akkomodasie Page</a>
            {envVars.supabaseUrl && (
              <a 
                href={envVars.supabaseUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                Supabase Dashboard
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}