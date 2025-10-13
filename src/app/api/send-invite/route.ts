// src/app/api/send-invite/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

// Initialize the Resend client with the API key.
// It automatically reads from process.env.RESEND_API_KEY.
const resend = new Resend();

export async function POST(request: Request) {
    try {
        const { familyId } = await request.json();
        if (!familyId) {
            return NextResponse.json({ error: 'Family ID is required.' }, { status: 400 });
        }

        // Fetch the specific family's details from Supabase.
        const { data: family, error: fetchError } = await supabase
            .from('families')
            .select(`
        email,
        family_name,
        invite_code,
        invite_sent,
        guests ( name, is_adult )
      `)
            .eq('id', familyId)
            .single();

        if (fetchError || !family) {
            return NextResponse.json({ error: `Family with ID ${familyId} not found.` }, { status: 404 });
        }

        if (family.invite_sent) {
            return NextResponse.json({ message: `Invite already sent to ${family.email}. No new email was sent.` });
        }

        const guestListHtml = family.guests.map((guest: { name: string, is_adult: boolean }) => `<li>${guest.name}${!guest.is_adult ? ' (kind)' : ''}</li>`).join('');

        // Send the email using Resend.
        const { data, error: emailError } = await resend.emails.send({
            from: 'Chané en Nickie <info@thundermerwefees.co.za>',
            to: [family.email],
            subject: `Uitnodiging na die #thunderMerweFees!`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #333;">
          <h2>Hallo ${family.family_name},</h2>
          <p>Hiermee volg dan die amptelike uitnodiging na ons troue!</p>
          <p></p>

          <img 
                src="https://www.thundermerwefees.co.za/uitnodiging.jpg" 
                alt="thunderMerweFees" 
                style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" 
            />

          <p>Die volgende persone vorm deel van jou uitnodiging:</p>
          <ul>${guestListHtml}</ul>
          <p>Die trou-webtuiste vir die #thunderMerweFees is nou lewendig. </p>
          <p>Druk op die knoppie hieronder en gaan deur die bladsye. Al die inligting is daarop saamgevat:</p>
          <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
          <a href="https://www.thundermerwefees.co.za/" style="display: inline-block; background-color: #3d251e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
            #thunderMerweFees Webtuiste
          </a>
          </div>
          <p>Ons vra dat jy asseblief so gou as moontlik die trou-webtuiste sal besoek, en dan voor 28 Februarie 2026 sal RSVP.</p>
          <p>Om die RSVP sisteem te gebruik, besoek die webtuiste, en gebruik die epos en uitnodigingskode soos hieronder om op die RSVP portaal in te teken.</p>
          <div style="background-color: #f2f2f2; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; letter-spacing: 3px; margin: 0;">Uitnodigins-epos: ${family.email}</p>
          </div>
          <div style="background-color: #f2f2f2; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; letter-spacing: 3px; margin: 0;">Uitnodiginskode: ${family.invite_code}</p>
          </div>
          <p style="margin-top: 20px;">Ons kan nie wag om die groot dag met julle te vier nie!</p>
          <p>Met baie liefde en vreugde,<br>Chané & Nickie</p>
        </div>
      `,
        });

        if (emailError) {
            // If Resend returns an error, throw it to be caught by the catch block.
            throw emailError;
        }

        const { error: updateError } = await supabase
            .from('families')
            .update({ invite_sent: true })
            .eq('id', familyId);

        if (updateError) {
            // Log this error but don't fail the request since the email was sent.
            console.error(`Failed to update invite_sent status for family ${familyId}:`, updateError);
        }

        return NextResponse.json({ message: `Invitation successfully sent to ${family.email}.` });

    } catch (error) {
        console.error('Failed to send invite:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}