// src/app/api/send-reminders/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // Sekuriteit: Jy kan hier 'n admin password check byvoeg as jy wil, 
  // of dit net plaaslik hardloop.
  
  try {
    // 1. Kry alle families wat nog nie ge-RSVP het nie
    const { data: pendingFamilies, error: fetchError } = await supabase
      .from('families')
      .select(`
        id,
        email,
        family_name,
        invite_code,
        guests ( name, is_adult )
      `)
      .eq('rsvp_status', 'pending'); // Die belangrike filter

    if (fetchError || !pendingFamilies) {
      return NextResponse.json({ error: 'Fout met ophaal van families' }, { status: 500 });
    }

    if (pendingFamilies.length === 0) {
      return NextResponse.json({ message: 'Geen families met pending RSVP status gevind nie.' });
    }

    console.log(`Gevind: ${pendingFamilies.length} families om te herinner.`);

    const results = [];

    // 2. Loop deur elke familie en stuur die email
    for (const family of pendingFamilies) {
      // Bou die gastelys HTML
      const guestListHtml = family.guests
        .map((guest: any) => `<li>${guest.name}${!guest.is_adult ? ' (kind)' : ''}</li>`)
        .join('');

      // Stuur email via Resend
      const { data, error } = await resend.emails.send({
        from: 'Chané en Nickie <info@thundermerwefees.co.za>',
        to: [family.email],
        // Verander subject sodat dit uitstaan
        subject: `Herinnering: RSVP vir die #thunderMerweFees`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #333;">
            <h2>Hallo ${family.family_name},</h2>
            <p>Net 'n vinnige, vriendelike herinnering oor ons troue!</p>
            
            <p>Ons sien julle status is nog hangend en ons wil graag seker maak julle het die uitnodiging ontvang.</p>

            <img 
                src="https://www.thundermerwefees.co.za/uitnodiging.jpg" 
                alt="thunderMerweFees" 
                style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" 
            />

            <p>Die gaste op julle uitnodiging is:</p>
            <ul>${guestListHtml}</ul>

            <p>Gaan asseblief na die webtuiste om te RSVP:</p>
            
            <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
              <a href="https://www.thundermerwefees.co.za/rsvp" style="display: inline-block; background-color: #3d251e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                Gaan na RSVP
              </a>
            </div>

            <div style="background-color: #f2f2f2; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="font-size: 18px; font-weight: bold; margin: 5px 0;">Epos: ${family.email}</p>
              <p style="font-size: 18px; font-weight: bold; letter-spacing: 3px; margin: 5px 0;">Kode: ${family.invite_code}</p>
            </div>

            <p>Ons hoop om julle daar te sien!</p>
            <p>Groete,<br>Chané & Nickie</p>
          </div>
        `,
      });

      if (error) {
        console.error(`Fout met stuur na ${family.email}:`, error);
        results.push({ email: family.email, status: 'failed', error });
      } else {
        console.log(`Herinnering gestuur na ${family.email}`);
        results.push({ email: family.email, status: 'sent', id: data?.id });
      }
      
      // Opsioneel: Wag 'n klein bietjie tussen emails om rate limits te verhoed (as die lys lank is)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ 
      message: `Proses voltooi. ${results.filter(r => r.status === 'sent').length} herinnerings gestuur.`,
      details: results 
    });

  } catch (error: any) {
    console.error('Groot fout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}