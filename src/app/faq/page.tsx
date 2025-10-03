export default function FAQ() {
  const faqs = [
    {
      question: "Wat is die kleredrag?",
      answer: "Formeel. Ons weet dit is warm, maar ons verwag van al die mans om das te dra. Ons nooi gaste om aardtone te dra soos groen, bruin, crème of goud."
    },
    {
      question: "Is daar kinders toegelaat?",
      answer: "Jou uitnodiging sal die kinders se name stipuleer."
    },
    {
      question: "Hoe werk die RSVP?",
      answer: "Gebruik asseblief die RSVP bladsy op hierdie webwerf om jou bespreking te maak voor 28 Februarie 2026."
    },
    {
      question: "Is daar parkering beskikbaar?",
      answer: "Ja, daar is genoeg parkering by beide die kerk en die onthaal."
    },
    {
      question: "Wat is die plan vir die weer?",
      answer: "Ons seremonie en onthaal is beide binne, maar bring tog 'n sambreel as jy sou wou."
    },
    {
      question: "Kan ek fotos neem tydens die seremonie?",
      answer: "Ons nooi gaste om soveel fotos en videos te neem soos julle kan. Volg die link op hierdie webtuiste om op te laai."
    },
    {
      question: "Is daar spesiale dieëte?",
      answer: "Ons volg gebalanseerde dieëte, jy kan eet waarvoor jy lus is."
    },
    {
      question: "Wat is die vervoer opsies?",
      answer: "Daar is verskeie akkommodasie opsies naby die venue. Sien die Akkommodasie bladsy vir meer besonderhede."
    },
    {
      question: "Hoe laat eindig die onthaal?",
      answer: "Die onthaal sal om 00:00 eindig. Ons moedig gaste aan om veilig tuis te ry."
    },
    {
      question: "Kan ek 'n metgesel saambring?",
      answer: "Ons RSVP is slegs vir die genooide gaste soos aangedui op jou uitnodiging."
    }
  ];

  return (
    <div className="min-h-screen bg-[#E8DBC5] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl  text-[#67472C] text-center mb-4">Vrae & Antwoorde</h1>
        {/* Decorative Strips - Use between sections */}
<div className="max-w-md mx-auto my-12">
  <div className="h-1 bg-[#97A887] mb-2"></div>
  <div className="h-1 bg-[#BB9F88] mb-2"></div>
  <div className="h-1 bg-[#656E5D]"></div>
</div>
        <p className="text-xl text-[#99735A] text-center mb-12">Alles wat jy nodig het om te weet vir ons spesiale dag</p>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-[#BB9F88] overflow-hidden">
              <details className="group">
                <summary className="list-none cursor-pointer">
                  <div className="px-6 py-4 flex justify-between items-center hover:bg-[#E8DBC5] transition-colors">
                    <h3 className="text-lg  text-[#67472C] pr-4">{faq.question}</h3>
                    <svg className="w-5 h-5 text-[#99735A] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 py-4 bg-[#E8DBC5] border-t border-[#BB9F88]">
                  <p className="text-[#656E5D] leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-[#CBD0B5] rounded-lg p-8 text-center">
          <h3 className="text-2xl  text-[#67472C] mb-4">Nog vrae?</h3>
          <p className="text-[#656E5D] mb-4">Moet nie huiwer om ons direk te kontak nie</p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 border border-[#BB9F88]">
              <p className="text-[#67472C] font-semibold">Nickie</p>
              <a href="tel:+27837022612" className="text-[#656E5D] text-sm hover:text-[#99735A] transition-colors">
                📞 083 702 2612
              </a>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 border border-[#BB9F88]">
              <p className="text-[#67472C] font-semibold">Chané</p>
              <a href="tel:+27762905997" className="text-[#656E5D] text-sm hover:text-[#99735A] transition-colors">
                📞 076 290 5997
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}