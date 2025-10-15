// src/app/api/send-confirmation/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { RSVPSessionData } from '@/types/rsvp-session';
import { getDrinkById } from '@/data/drink-options';

const resend = new Resend();

// This is the main function that will be executed when a POST request is made to this endpoint.
export async function POST(request: Request) {
    try {
        // The request body will contain the final session data from the user's RSVP submission.
        const session: RSVPSessionData = await request.json();

        if (!session || !session.familyId || !session.guests || session.guests.length === 0) {
            return NextResponse.json({ error: 'Valid session data is required.' }, { status: 400 });
        }

        const { data: family, error: fetchError } = await supabase
            .from('families')
            .select(`
                email,
                family_name,
                confirmation_sent,
                guests ( name, is_adult )
            `)
            .eq('id', session.familyId)
            .single();

        if (fetchError || !family) {
            return NextResponse.json({ error: `Family with ID ${session.familyId} not found.` }, { status: 404 });
        }

        const familyEmail = family?.email; 

        if (!familyEmail) {
            return NextResponse.json({ error: 'No email found in session data.' }, { status: 400 });
        }

        const attendingGuests = session.guests.filter(g => g.is_attending);
        const noOneAttending = attendingGuests.length === 0;

        let subject = '';
        let htmlContent = '';

        if (noOneAttending) {
            subject = 'RSVP Bevestiging: Gaan nie bywoon nie.';
            htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #333;"">
          <h2>Hallo ${session.familyName},</h2>
          <p></p>
          <p>Hiermee word bevestig dat ons die RSVP ontvang het waar daar aangedui was dat julle nie gaan bywoon nie.</p>
          <p>Alhoewel ons dit graag saam julle wou gedeel het, verstaan ons en ons bedank dat julle die RSVP voltooi het.</p>
          <p></p>
          
          <p>Met baie liefde en vreugde,<br>Chané & Nickie</p>

          <img 
                src="https://www.thundermerwefees.co.za/hoof-foto.jpg" 
                alt="thunderMerweFees" 
                style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; margin-top: 15px;"
            />

            <p>Nota: Hierdie epos is outomaties ge-genereer so laat weet vir Nickie as enige inligting nie korrek is nie.</p>

        </div>
      `;
        }
        // --- Branch 2: Email content for families who ARE attending ---
        else {
            subject = 'RSVP Bevestiging vir die #thunderMerweFees!';
            const guestDetailsHtml = attendingGuests.map(guest => `
        <div style="margin-bottom: 15px; border-left: 3px solid #eee; padding-left: 15px;">
          <h4 style="margin-bottom: 5px; color: #3d251e;">${guest.name}</h4>
          ${guest.songRequest ? `<p style="font-size: 14px; margin: 2px 0;"><strong>Liedjie versoek:</strong> ${guest.songRequest}</p>` : ''}
          ${guest.drinkPreferences.length > 0 ? `<p style="font-size: 14px; margin: 2px 0;"><strong>Drank voorkeure:</strong> ${guest.drinkPreferences.map(id => getDrinkById(id)?.name).join(', ')}</p>` : ''}
          ${guest.extraNotes ? `<p style="font-size: 14px; margin: 2px 0;"><strong>Notas:</strong> ${guest.extraNotes}</p>` : ''}
        </div>
      `).join('');

            htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; color: #333;"">
          <h2>Hallo ${session.familyName},</h2>
          <p>Dankie vir die RSVP! Ons het al julle besonderhede suksesvol ontvang, en ons kan nie wag om die groot dag met julle te deel nie!</p>
          <h3 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px;">RSVP Opsomming:</h3>
          <p><strong>Bywonende Gaste:</strong></p>
          ${guestDetailsHtml}
          <p style="margin-top: 35px;">Besoek gerus ons webtuiste weer vir al die inligting rakende die groot dag:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://www.thundermerwefees.co.za/besonderhede" style="display: inline-block; background-color: #3d251e; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
              Besonderhede
            </a>
          </div>
          <p>Tot die 28 ste Maart 2026!</p>
          <p>Met baie liefde en vreugde,<br>Chané & Nickie</p>
          <img 
                src="https://www.thundermerwefees.co.za/hoof-foto.jpg" 
                alt="thunderMerweFees" 
                style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; margin-top: 15px;"
            />

            <p>Nota: Hierdie epos is outomaties ge-genereer so laat weet vir Nickie as enige inligting nie korrek is nie.</p>
            
        </div>
      `;
        }

        // Send the email using the Resend SDK.
        await resend.emails.send({
            from: 'RSVP Bevestiging <info@thundermerwefees.co.za>',
            to: [familyEmail],
            subject: subject,
            html: htmlContent,
        });

        // After a successful send, update the 'confirmation_sent' flag in the database.
        const { error: updateError } = await supabase
            .from('families')
            .update({ confirmation_sent: true })
            .eq('id', session.familyId);

        if (updateError) {
            // If this fails, the email has still been sent. Log it for admin review.
            console.error(`CRITICAL: Confirmation email sent to ${familyEmail} but failed to update 'confirmation_sent' flag for familyId ${session.familyId}:`, updateError);
        }

        return NextResponse.json({ message: 'Confirmation email sent successfully.' });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error('Failed to send confirmation email:', error);
        return NextResponse.json({ error: `Failed to send confirmation email: ${errorMessage}` }, { status: 500 });
    }
}