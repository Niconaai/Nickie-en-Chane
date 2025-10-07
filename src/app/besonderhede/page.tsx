import WeatherForecast from '@/components/weather-forcast/WeatherForecast';
import Image from "next/image";

export const metadata = {
  title: 'C&N | Besonderhede',
}

const kleredrag = `Streng formeel. Dames, ons vra dat julle asseblief GEEN wit of swart rokke sal dra nie. Ons versoek van die dames om 'n formele rok, of kleredrag aan te trek - GEEN cocktail rokke nie asseblief. Mans, ons vra dat julle asseblief GEEN jeans of kortmou-hemde sal dra nie. Ons versoek al die mans om 'n langmou-hemp en 'n das te dra. Jy is welkom om 'n pak-baadjie ook aan te trek, maar dit is opsioneel.`

export default function Besonderhede() {
  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <div className="max-w-[80vw] md:max-w-[60vw] mx-auto">
        <h1 className="text-5xl font-semibold text-[#67472C] font-semibold text-center mb-12">Besonderhede</h1>

        {/* Decorative Strips - Use between sections */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>

        {/* Timeline Section */}
        <div>
          <div className="max-w-[90vw] md:max-w-[60vw] mx-auto md:mb-8 mb-1 rounded-2xl shadow-lg border-1">
            <Image
              src="/besonderhede/tydlyn.svg"
              alt="tydlyn"
              width={1400}
              height={1000}
              className="rounded-lg mx-auto w-full h-auto"
            />
          </div>
        </div>

        {/* Decorative Strips - Use between sections */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>

        {/* Locations */}
        <h2 className="text-4xl text-[#67472C] font-semibold text-center mb-8 " style={{ marginTop: '40px' }}>Maps en Weervoorspelling</h2 >
        <div className="grid md:grid-cols-2 gap-8">

          {/* Seremonie */}
          <div className="text-center bg-white rounded-lg shadow-lg p-6 ">
            <h2 className="text-3xl  text-[#99735A] mb-4">Seremonie</h2>
            <div className="space-y-3 text-[#656E5D] mb-4">
              <p className="font-semibold">Datum: 28 Maart 2025</p>
              <p className="font-semibold">Tyd: 15:00</p>
              <p>NG Kerk Brits</p>
              <p>H/V Kerk- en Reitz Straat</p>
              <p>Brits, Noordwes</p>
            </div>
            <div className="h-75 bg-gray-200 rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4678.916735359521!2d27.77288207645163!3d-25.637954141154136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebe302e4d535d6d%3A0x515903fa8e1d1154!2sNG%20Gemeente%20Brits!5e1!3m2!1sen!2sza!4v1759429459121!5m2!1sen!2sza"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Onthaal */}
          <div className="text-center bg-white rounded-lg shadow-lg p-6 ">
            <h2 className="text-3xl  text-[#99735A] mb-4">Onthaal</h2>
            <div className="space-y-3 text-[#656E5D] mb-4">
              <p className="font-semibold">Datum: 28 Maart 2025</p>
              <p className="font-semibold">Tyd: 18:00</p>
              <p>KF49 Citrus Pakhuis</p>
              <p>Kleinfontein</p>
              <p>Brits, Noordwes</p>
            </div>
            <div className="h-75 bg-gray-200 rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4683.338674016627!2d27.768907476448632!3d-25.52489593665522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebe37f9de3dbc31%3A0x37e2318b3b2f00c9!2sKF49%20Citrus%20Packhouse!5e1!3m2!1sen!2sza!4v1759429776057!5m2!1sen!2sza"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div style={{ marginTop: '40px' }}>
            {/* Other content */}
            <WeatherForecast targetDate="2026-03-28T15:00:00"/>
          </div>

          <div style={{ marginTop: '40px' }}>
            {/* Other content */}
            <WeatherForecast targetDate="2026-03-28T21:00:00"/>
          </div>
        </div>

        {/* Decorative Strips - Use between sections */}
        <div className="max-w-[80vw] md:max-w-[60vw] mx-auto my-12">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>

        <h2 className="text-4xl text-[#67472C] font-semibold text-center mb-8 " style={{ marginTop: '40px' }}>Kleredrag Riglyne</h2 >

        <div className="bg-white rounded-lg shadow-lg border border-[#BB9F88] overflow-hidden">
          <details className="group">
            <summary className="list-none cursor-pointer">
              <div className="px-6 py-4 flex justify-between items-center hover:bg-[#E8DBC5] transition-colors">
                <h3 className="md:text-3xl text-2xl text-[#67472C] pr-4">Inligting</h3>
                <svg className="w-5 h-5 text-[#99735A] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="px-6 py-4 bg-white border-t border-[#BB9F88]">
              <p className="md:text-2xl text-xl text-[#656E5D] leading-relaxed">{kleredrag}</p>
            </div>
          </details>
        </div>

        <div className="mx-auto space-y-16" style={{ marginTop: '40px' }} >
          <div>
            <h2 className="text-3xl text-[#67472C] font-bold text-center mb-8">Kleurpalet</h2>
            <div className="max-w-[80vw] md:w-[60vw] rounded-2xl shadow-2xl border-0 border-white p-2 bg-white">
              <Image
                src="/besonderhede/kleur-palette.jpg"
                alt="kleur-palette"
                width={1400}
                height={1000}
                className="max-w-[90vw] md:max-w-[60vw] rounded-lg mx-auto w-full h-auto"
              />
            </div>
          </div>

          {/* MOETS Section */}
          <div>
            <h2 className="text-3xl text-[#67472C] font-bold text-center mb-8">MOETS</h2>
            <div className="max-w-[90vw] md:max-w-[60vw] grid grid-cols-1 md:grid-cols-1 gap-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="rounded-2xl shadow-2xl border-4 border-white p-4 bg-white">
                  <Image
                    src={`/besonderhede/Moets${num}.jpg`}
                    alt={`Moets ${num}`}
                    width={1400}
                    height={1000}
                    className="max-w-[90vw] md:max-w-[60vw] rounded-lg mx-auto w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* MOENIES Section */}
          <div>
            <h2 className="text-3xl font-bold text-[#67472C] text-center mb-8 line-through">MOENIES</h2>
            <div className="rounded-2xl shadow-2xl border-4 border-white p-4 bg-white">
              <Image
                src="/besonderhede/Moenies.jpg"
                alt="Moenies"
                width={1400}
                height={1000}
                className="rounded-lg mx-auto w-full h-auto"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}