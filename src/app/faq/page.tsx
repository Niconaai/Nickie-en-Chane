export const metadata = {
  title: 'C&N | V en A',
}

export default function FAQ() {
  const faqs = [
    {
      question: "Wat is die kleredrag-kode?",
      answer: "Streng formeel. Dames, ons vra dat julle asseblief GEEN wit of swart rokke sal dra nie. Ons versoek van die dames om 'n formele rok, of kleredrag aan te trek - GEEN cocktail rokke nie asseblief. Mans, ons vra dat julle asseblief GEEN jeans of kortmou-hemde sal dra nie. Ons versoek al die mans om 'n langmou-hemp en 'n das te dra. Jy is welkom om 'n pak-baadjie ook aan te trek, maar dit is opsioneel. Sien die Besonderhede bladsy vir riglyne met prentjies."
    },
    {
      question: "Hoe werk die RSVP?",
      answer: "Gebruik asseblief die RSVP portaal op hierdie webwerf om jou bespreking te maak voor 31 Januarie 2026. Jy moet ook asseblief die RSVP diens gebruik al kom jy nie. Per persoon gaan jy moet aandui of jy kom, tesame met jou liedjie-versoeke, asook drank voorkeure. Voor jou RSVP kan finaliseer gaan jy 'n deposito per volwassene moet betaal."
    },
    {
      question: "Wat is die Deposito?",
      answer: "Ons vra elke volwasse gas om 'n deposito van R300 te betaal om jou sitplek te bevestig. Jy kan die betaling veilig via die RSVP-portaal doen. Jy kan ook aandui of jy die deposito ná die troue wil terugkry, of dit as 'n geskenk aan die bruidspaar wil gee. Let asseblief daarop: indien jy RSVP doen en aandui dat jy kom, maar nie opdaag nie, sal die deposito nie terugbetaal word nie."
    },
    {
      question: "Is dit veilig om die betaling op die webtuiste te doen?",
      answer: "Ja, dit is veilig. Die betaling gebeur deur die YOCO platform wat ten volle veilig is. Dit gee jou die opsie om met óf Apple Pay, óf Google Pay, óf krediet/debiet kaart te betaal."
    },
    {
      question: "Is daar 'n ander manier om die deposito te betaal?",
      answer: "Ja, jy kan gerus 'n elektroniese oorbetaling doen. Bankbesonderhede:\nNJ VAN DER MERWE\nCapitec Savings Account\nRekening no: 1401663581\nVerwysing: *JOU NAAM EN VAN*."
    },
    {
      question: "Kan ek my kinders saambring?",
      answer: "Jou uitnodiging en die RSVP portaal sal vir jou aandui of jou kinders deel vorm van die uitnodiging."
    },
    {
      question: "Is daar parkering beskikbaar?",
      answer: "Ja, daar is genoeg parkering by die kerk en die onthaal."
    },
    {
      question: "Wat is die plan vir die weer?",
      answer: "Ons seremonie en onthaal geskiet binnens-huis. Loer gerus op die Besonderhede bladsy na die weervoorspelling."
    },
    {
      question: "Kan ek foto's neem tydens die seremonie?",
      answer: "Ons nooi gaste om soveel foto's en video's te neem soos julle kan. Daar sal 'n Google Drive-link nader aan die tyd beskikbaar gemaak word waar jy alles kan oplaai."
    },
    {
      question: "Wat as ek allergieë het?",
      answer: "Indien jy allergieë het, kontak vir Chané."
    },
    {
      question: "Is daar slaapplek by die onthaal?",
      answer: "Nee, maar daar is verskeie akkommodasie opsies naby die onthaal. Sien die Akkommodasie bladsy vir meer besonderhede, of kontak vir Chané."
    },
    {
      question: "Hoe laat eindig die onthaal?",
      answer: "Die onthaal sal om 00:00 eindig."
    },
    {
      question: "Mag ek my eie drank saambring?",
      answer: "Alhoewel die onthaal op die plaas geskied, versoek ons tog van die gaste om nie jou eie drank tydens die onthaal te gebruik nie. Daar sal 'n kontantkroeg beskikbaar wees."
    },
    {
      question: "Kan ek 'n metgesel saambring?",
      answer: "Jou uitnodiging en die RSVP portaal sal vir jou aandui of jy 'n metgesel kan saambring."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <div className="max-w-[80vw] md:max-w-[60vw] mx-auto">
        <h1 className="text-5xl font-semibold text-[#67472C] text-center mb-4">Vrae & Antwoorde</h1>
        {/* Decorative Strips - Use between sections */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>
        <p className="text-3xl text-[#99735A] text-center mb-12">Alles wat jy moet weet oor ons spesiale dag</p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-[#BB9F88] overflow-hidden">
              <details className="group">
                <summary className="list-none cursor-pointer">
                  <div className="px-6 py-4 flex justify-between items-center hover:bg-[#E8DBC5] transition-colors">
                    <h3 className="md:text-3xl text-2xl text-[#67472C] pr-4">{faq.question}</h3>
                    <svg className="w-5 h-5 text-[#99735A] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 py-4 bg-white border-t border-[#BB9F88]">
                  {faq.answer.split('\n').map((line, i) => (
                    <p key={i} className="md:text-2xl text-xl text-[#656E5D] leading-relaxed mb-0 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-[#CBD0B5] rounded-lg p-8 text-center">
          <h3 className="md:text-5xl text-3xl text-[#67472C] mb-4">Nog vrae?</h3>
          <p className="md:text-2xl text-xl text-[#656E5D] mb-8">Kontak ons gerus.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="bg-white rounded-lg px-4 py-2 border border-[#BB9F88]">
              <p className="md:text-2xl text-3xl text-[#67472C] font-semibold">Chané</p>
              <a href="tel:+27762905997" className="text-[#656E5D] md:text-2xl text-xl hover:text-[#99735A] transition-colors">
                📞 076 290 5997
              </a>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border border-[#BB9F88]">
              <p className="md:text-2xl text-3xl text-[#67472C] font-semibold">Nickie</p>
              <a href="tel:+27837022612" className="md:text-2xl text-xl text-[#656E5D] hover:text-[#99735A] transition-colors">
                📞 083 702 2612
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}