'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Family, Guest } from '@/components/admin/types';

interface RSVPLoginProps {
  onLoginSuccess: (family: Family, guests: Guest[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function RSVPLogin({ onLoginSuccess, onLoadingChange }: RSVPLoginProps) {
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    onLoadingChange(true);

    try {
      // Soek vir die familie
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('invite_code', inviteCode.trim())
        .single();

      if (familyError || !familyData) {
        setError('Ongeldige e-pos of uitnodigingskode. Probeer weer.');
        onLoadingChange(false);
        return;
      }

      // Kry al die gaste vir hierdie familie
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('family_id', familyData.id)
        .order('is_adult', { ascending: false })
        .order('name');

      if (guestsError) {
        setError('Fout met laai gaste. Probeer weer.');
        onLoadingChange(false);
        return;
      }

      onLoginSuccess(familyData, guestsData || []);
      
    } catch (error) {
      setError('Iets het verkeerd geloop. Probeer weer.');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>Teken In om te RSVP</h2>
        <p style={{ color: '#8b6c5c' }}>
          Gebruik die e-pos en uitnodigingskode wat aan jou gestuur is
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#3d251e' }}>
              E-pos Adres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              style={{ color: '#3d251e' }}
              placeholder="jou@voorbeeld.com"
              required
            />
          </div>

          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium mb-1" style={{ color: '#3d251e' }}>
              Uitnodigingskode
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              style={{ color: '#3d251e' }}
              placeholder="Voer jou unieke kode in"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: '#3d251e' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c4033'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3d251e'}
          >
            Teken In
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: '#8b6c5c' }}>
          Probleme met inteken? Kontak gerus vir Nickie of Chané.
          
        </p>
      </div>
    </div>
  );
}