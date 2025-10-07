'use client';

import { RSVPSessionData } from '@/types/rsvp-session';
import { getDrinkById } from '@/data/drink-options';
import { Payment } from '@/components/admin/types';

interface RSVPSummaryProps {
    familyName: string;
    session: RSVPSessionData;
    familyId: string;
    payments?: Payment[];
    onLogout: () => void;
}

export default function RSVPSummary({ familyName, session, familyId, payments, onLogout }: RSVPSummaryProps) {
    const attendingGuests = session.guests.filter(guest => guest.is_attending);
    const noOneAttending = attendingGuests.length === 0;

    // Check payment status
    const familyPayment = payments?.find(p => p.family_id === familyId);
    const hasPaidDeposit = familyPayment?.payment_status === 'paid';
    const depositAmount = attendingGuests.filter(g => g.is_adult).length * 300;
    const needsDeposit = depositAmount > 0 && !hasPaidDeposit;

    if (noOneAttending) {
        return (
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-6">
                    <div className="text-gray-600 text-4xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#3d251e' }}>
                        Jou RSVP Opsomming
                    </h2>
                    <p style={{ color: '#5c4033' }} className="mb-4">
                        Ons neem kennis dat niemand van {familyName} kan bywoon nie.
                    </p>
                    <p style={{ color: '#8b6c5c' }} className="text-sm mb-6">
                        Indien jy veranderinge wil aanbring, kontak asseblief die bruidspaar direk.
                    </p>
                    <h4 className="font-medium mb-2" style={{ color: '#5c4033' }}>
                        Deposito Opsie
                    </h4>
                    <p style={{ color: '#8b6c5c' }} className="text-sm">
                        {session.depositOption === 'gift'
                            ? '💝 Die deposito word as \'n geskenk aanvaar'
                            : '💰 Die deposito sal terugbetaal word na die troue'
                        }
                    </p>
                </div>

                <button
                    onClick={onLogout}
                    className="px-6 py-2 text-blue-600 hover:text-blue-800 underline"
                >
                    Teken Uit
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#3d251e' }}>
                    Jou RSVP Opsomming
                </h2>
                <p style={{ color: '#8b6c5c' }}>
                    Hier is &apos;n opsomming vir {familyName}
                </p>
            </div>

            {/* Opsomming Kaart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#3d251e' }}>
                    RSVP Besonderhede
                </h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2" style={{ color: '#5c4033' }}>
                            Bywonende Gaste ({attendingGuests.length})
                        </h4>
                        <ul className="space-y-2">
                            {attendingGuests.map((guest) => (
                                <li key={guest.id} className="border-l-4 border-green-500 pl-3 py-1">
                                    <span className="font-medium" style={{ color: '#3d251e' }}>{guest.name}</span>
                                    <span className="text-sm ml-2" style={{ color: '#8b6c5c' }}>
                                        ({guest.is_adult ? 'Volwassene' : 'Kind'})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liedjie Versoeke */}
                    {attendingGuests.some(g => g.songRequest) && (
                        <div>
                            <h4 className="font-medium mb-2" style={{ color: '#5c4033' }}>
                                Liedjie Versoeke
                            </h4>
                            <ul className="space-y-3">
                                {attendingGuests
                                    .filter(g => g.songRequest)
                                    .map((guest) => (
                                        <li key={guest.id} className="flex items-center space-x-3">
                                            {/* Album Art - gebruik guest.songAlbumArt direk */}
                                            {guest.songAlbumArt && (
                                                <img
                                                    src={guest.songAlbumArt}
                                                    alt="Album cover"
                                                    className="w-12 h-12 rounded flex-shrink-0"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium" style={{ color: '#3d251e' }}>
                                                    {guest.name}
                                                </p>
                                                <p className="text-sm" style={{ color: '#8b6c5c' }}>
                                                    {guest.songRequest}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )}

                    {/* Drank Voorkeure */}
                    {attendingGuests.some(g => g.drinkPreferences.length > 0) && (
                        <div>
                            <h4 className="font-medium mb-1" style={{ color: '#5c4033', marginTop: '30px' }}>
                                Drank Voorkeure
                            </h4>
                            <ul className="space-y-2">
                                {attendingGuests
                                    .filter(g => g.drinkPreferences.length > 0)
                                    .map((guest) => {
                                        const drinkNames = guest.drinkPreferences
                                            .map(drinkId => getDrinkById(drinkId)?.name)
                                            .filter(Boolean)
                                            .join(', ');

                                        return (
                                            <li key={guest.id} className="text-sm" style={{ color: '#8b6c5c' }}>
                                                <span className="font-medium">{guest.name}:</span> {drinkNames}
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    )}

                    {/* Notas */}
                    {attendingGuests.some(g => g.extraNotes) && (
                        <div>
                            <h4 className="font-medium mb-2" style={{ color: '#5c4033', marginTop: '30px' }}>
                                Addisionele Notas
                            </h4>
                            <ul className="space-y-2">
                                {attendingGuests
                                    .filter(g => g.extraNotes)
                                    .map((guest) => (
                                        <li key={guest.id} className="text-sm" style={{ color: '#8b6c5c' }}>
                                            <span className="font-medium">{guest.name}:</span> {guest.extraNotes}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Betaling Status */}
            <div className={`border rounded-lg p-4 mb-6 ${hasPaidDeposit
                ? 'bg-green-50 border-green-200'
                : needsDeposit
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                <h4 className="font-medium mb-2" style={{ color: '#3d251e' }}>Betaling Status</h4>

                {hasPaidDeposit ? (
                    <div>
                        <p style={{ color: '#5c4033' }} className="text-sm">
                            Deposito betaal: R{depositAmount}
                        </p>
                        {familyPayment?.paid_at && (
                            <p style={{ color: '#8b6c5c' }} className="text-xs mt-1">
                                Betaal op: {new Date(familyPayment.paid_at).toLocaleDateString('af-ZA')}
                            </p>
                        )}
                        {/* DEPOSITO OPSIE - gebruik session.depositOption direk */}
                        {session.depositOption && (
                            <p style={{ color: '#8b6c5c' }} className="text-xs mt-1">
                                {session.depositOption === 'gift'
                                    ? 'Deposito word as \'n geskenk gegee.'
                                    : 'Aangedui dat die deposito terug betaal moet word.'
                                }
                            </p>
                        )}
                    </div>
                ) : needsDeposit ? (
                    <div>
                        <p style={{ color: '#5c4033' }} className="text-sm">
                            Deposito benodig: R{depositAmount}
                        </p>
                        {/* DEPOSITO OPSIE - gebruik session.depositOption direk */}
                        {session.depositOption && (
                            <p style={{ color: '#8b6c5c' }} className="text-xs mt-1">
                                {session.depositOption === 'gift'
                                    ? 'Sal as geskenk gegee word'
                                    : 'Sal terugbetaal word na troue'
                                }
                            </p>
                        )}
                        <p style={{ color: '#8b6c5c' }} className="text-xs mt-1">
                            Kontak die bruidspaar vir betalingsbesonderhede.
                        </p>
                    </div>
                ) : (
                    <p style={{ color: '#5c4033' }} className="text-sm">
                        Geen deposito nodig
                    </p>
                )}

                <p style={{ color: '#8b6c5c' }} className="text-xs mt-2">
                    Kontak die bruidspaar vir enige veranderinge aan jou RSVP.
                </p>
            </div>

            <div className="text-center">
                <button
                    onClick={onLogout}
                    className="px-6 py-2 text-blue-600 hover:text-blue-800 underline"
                >
                    Teken Uit
                </button>
            </div>
        </div>
    );
}