'use client';

import { useState, useEffect } from 'react';

export default function FAQ() {
    const faqs = [
        {
            question: "Wat is die kleredrag-kode?",
            answer: `Ter handhawing van die formaliteit van die geleentheid, word gaste beleefd versoek om by die volgende voorskrifte te hou:

Dames:
Daar word versoek dat dames uitrustings in wit of swart vermy. 'n Formele, vollengte aandrok of ekwivalente formele drag word vereis. Skemerkelkdrag (cocktail) word as onvanpas beskou.

Mans:
Die voorgeskrewe drag vir here is 'n langmouhemp en 'n das. Gaste word versoek om nie in denim of kortmouhemde geklee te wees nie. Alhoewel 'n pakbaadjie nie verpligtend is nie, word dit aangemoedig.

Visuele riglyne word op die "Besonderhede"-bladsy aangebied.`
        },
        {
            question: "Hoe werk die RSVP?",
            answer: `Ons versoek u vriendelik om u bywoning voor of op 28 Februarie 2026 te bevestig deur die RSVP-portaal op hierdie webtuiste te gebruik. Hierdie proses is ook nodig indien u die uitnodiging nie kan aanvaar nie.

Gedurende die bevestigingsproses sal u die geleentheid hê om u liedjieversoeke en drankvoorkeure per gas aan te dui.

Neem asseblief kennis dat u RSVP gefinaliseer word met die betaling van die vereiste deposito per volwassene.`
        },
        {
            question: "Wat is die Deposito?",
            answer: `'n Deposito van R300 per volwasse gas word vereis om u bespreking te finaliseer. Die betaling kan veilig deur die RSVP-portaal gemaak word.

Gaste het die keuse om aan te dui of die deposito na afloop van die geleentheid terugbetaal moet word, en of dit as 'n bydrae tot die bruidspaar se geskenk aangewend kan word.

Neem asseblief kennis dat die deposito verbeur sal word indien 'n gas, ná bevestiging van bywoning, die geleentheid nie bywoon nie.`
        },
        {
            question: "Is dit veilig om die betaling op die webtuiste te doen?",
            answer: `Ja, alle transaksies word deur Yoco, 'n gesertifiseerde en veilige betalingsplatform, hanteer. U kan met gemoedsrus betaal deur van die volgende metodes gebruik te maak: Apple Pay, Google Pay, of 'n krediet- en debietkaart.`
        },
        {
            question: "Is daar 'n ander manier om die deposito te betaal?",
            answer: `Ja, 'n elektroniese fondsoorplasing (EFT) word ook aanvaar. Gebruik asseblief die volgende bankbesonderhede vir die oorbetaling:\n\n
Bank: Capitec
Rekeninghouer: NJ VAN DER MERWE
Rekeningtipe: Spaar (Savings)
Rekeningnommer: 1401663581
Verwysing: U volle naam en van
Dit is noodsaaklik om die korrekte verwysing te gebruik om te verseker dat u betaling korrek toegewys word.`
        },
        {
            question: "Kan ek my kinders saambring?",
            answer: "Die uitnodiging is van toepassing op die gaste wie se name spesifiek op u uitnodigingskaart en in die RSVP-portaal gelys word. Slegs die name soos aangedui, is vir die geleentheid op die gastelys voorsien."
        },
        {
            question: "Is daar parkering beskikbaar?",
            answer: "Ja, voldoende en veilige parkering is by beide die seremonie- en onthaal-venues beskikbaar vir alle gaste."
        },
        {
            question: "Gaan die weer 'n invloed hê?",
            answer: "Beide die seremonie en die onthaal word binnenshuis gehou, dus is die verrigtinge nie van die weer afhanklik nie. Vir u persoonlike beplanning kan u die weervoorspelling op die 'Besonderhede'-bladsy raadpleeg."
        },
        {
            question: "Kan ek foto's neem tydens die seremonie?",
            answer: "Ja, gaste word aangemoedig om foto's en video's te neem. 'n Skakel na 'n gedeelde aanlyn album sal op 'n later stadium verskaf word, waar u genooi sal word om u media op te laai as 'n bydrae tot die herinneringe van die dag."
        },
        {
            question: "Wat as ek allergieë het?",
            answer: "Indien u enige dieetvereistes of ernstige allergieë het, geliewe dit asseblief duidelik aan te dui in die toegewysde spasie wanneer u die RSVP-proses voltooi. Vir enige spesifieke of dringende navrae in hierdie verband, kan u Chané direk kontak. Dit is noodsaaklik dat ons hierdie inligting voor die RSVP-sperdatum ontvang om die nodige spysenieringsreëlings te tref."
        },
        {
            question: "Is daar slaapplek by die onthaal?",
            answer: `Verblyf is nie op die perseel van die onthaalvenue beskikbaar nie. Vir u gerief het ons egter 'n lys van aanbevole verblyfopsies in die nabyheid saamgestel. U kan hierdie inligting op die 'Akkommodasie'-bladsy vind.

Indien u verdere bystand of persoonlike aanbevelings benodig, is u welkom om Chané te kontak.`
        },
        {
            question: "Hoe laat eindig die onthaal?",
            answer: "Die onthaal sal om 00:00 eindig."
        },
        {
            question: "Mag ek my eie drank saambring?",
            answer: "Gaste word beleefd versoek om nie hul eie drank na die onthaal te bring nie. 'n Volledig toegeruste kontantkroeg sal gedurende die geleentheid beskikbaar wees vir die aankoop van verversings."
        },
        {
            question: "Mag ek 'n metgesel saambring?",
            answer: "U uitnodiging is spesifiek gerig aan die gas(te) wie se naam daarop verskyn. Raadpleeg asseblief u uitnodigings-epos, asook die RSVP-portaal, waar dit duidelik aangedui sal wees indien u uitgenooi is om 'n metgesel te bring."
        }
    ];

    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);

            setShowScrollToTop(distanceFromBottom < 300 && scrollPosition > 100);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on initial render

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

            {showScrollToTop && (
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        onClick={scrollToTop}
                        className="bg-white rounded-full shadow-lg border border-gray-300 p-3 hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-center text-[#5c4033]">
                            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <p className="text-xs mt-1">Terug Op</p>
                        </div>
                    </button>
                </div>
            )}
        </div >
    );
}