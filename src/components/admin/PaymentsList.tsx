'use client';

import { Payment, Family } from './types';

interface PaymentsListProps {
  payments: Payment[];
  families: Family[];
  onUpdatePayment: (paymentId: string, updates: Partial<Payment>) => void;
}

export default function PaymentsList({ payments, families, onUpdatePayment }: PaymentsListProps) {
  const getFamilyName = (familyId: string) => {
    const family = families.find(f => f.id === familyId);
    return family?.family_name || 'Onbekend';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentMethodText = (method: string) => {
    return method === 'ikhoka' ? 'Kaart Betaling' : 'EFT';
  };

  const handleMarkAsPaid = async (payment: Payment) => {
    const paidAmount = prompt('Hoeveelheid betaal (in Rand):', (payment.amount / 100).toString());
    const paidBy = prompt('Naam van persoon wat betaal het:');
    
    if (!paidAmount || !paidBy) return;

    const updates = {
      payment_status: 'paid' as const,
      paid_amount: Math.round(parseFloat(paidAmount) * 100),
      paid_by: paidBy,
      paid_at: new Date().toISOString()
    };

    onUpdatePayment(payment.id, updates);
  };

  const handleChangeMethod = async (payment: Payment) => {
    const newMethod = payment.payment_method === 'ikhoka' ? 'eft' : 'ikhoka';
    onUpdatePayment(payment.id, { payment_method: newMethod });
  };

  const handleChangeDepositOption = async (payment: Payment) => {
    const newOption = payment.deposit_option === 'gift' ? 'refund' : 'gift';
    onUpdatePayment(payment.id, { deposit_option: newOption });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Betalings Bestuur</h2>
        <div className="flex space-x-4 mt-2 text-sm text-gray-600">
          <span>Totaal: {payments.length}</span>
          <span>Betaal: {payments.filter(p => p.payment_status === 'paid').length}</span>
          <span>Hangend: {payments.filter(p => p.payment_status === 'pending').length}</span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <div key={payment.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {getFamilyName(payment.family_id)}
                </h3>
                <div className="flex space-x-4 mt-2 text-sm text-gray-700">
                  <span>Bedrag: R{(payment.amount / 100).toFixed(2)}</span>
                  <span>Metode: {getPaymentMethodText(payment.payment_method)}</span>
                  <span className={`px-2 py-1 rounded ${getPaymentStatusColor(payment.payment_status)}`}>
                    {payment.payment_status === 'paid' ? 'Betaal' : 
                     payment.payment_status === 'failed' ? 'Misluk' : 'Hangend'}
                  </span>
                </div>
                
                {payment.paid_at && (
                  <div className="text-sm text-gray-600 mt-1">
                    Betaal op: {new Date(payment.paid_at).toLocaleDateString('af-ZA')}
                    {payment.paid_by && ` • deur ${payment.paid_by}`}
                  </div>
                )}

                {payment.deposit_option && (
                  <div className="text-sm text-gray-600 mt-1">
                    Deposito opsie: {payment.deposit_option === 'gift' ? 'Geskenk' : 'Terugbetaling'}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {payment.payment_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleMarkAsPaid(payment)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      Merk as Betaal
                    </button>
                    <button
                      onClick={() => handleChangeMethod(payment)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Verander Metode
                    </button>
                  </>
                )}
                
                {payment.payment_status === 'paid' && payment.deposit_option && (
                  <button
                    onClick={() => handleChangeDepositOption(payment)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-sm"
                  >
                    {payment.deposit_option === 'gift' ? 'Maak Terugbetaling' : 'Maak Geskenk'}
                  </button>
                )}
              </div>
            </div>

            {/* Payment History */}
            {payment.payment_status === 'paid' && (
              <div className="bg-gray-50 p-3 rounded border">
                <h4 className="font-medium text-gray-900 text-sm mb-2">Betaling Besonderhede</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>Betaal Bedrag: R{((payment.paid_amount || payment.amount) / 100).toFixed(2)}</div>
                  <div>Betaal Metode: {getPaymentMethodText(payment.payment_method)}</div>
                  <div>Betaal Datum: {new Date(payment.paid_at!).toLocaleDateString('af-ZA')}</div>
                  <div>Betaal deur: {payment.paid_by || 'Onbekend'}</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {payments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Geen betalings gevind nie.
          </div>
        )}
      </div>
    </div>
  );
}