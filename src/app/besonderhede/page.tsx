export default function Besonderhede() {
  return (
    <div className="min-h-screen bg-[#FFF7E3] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#67472C] text-center mb-12">Besonderhede</h1>
        
        {/* Decorative Strips - Use between sections */}
<div className="max-w-md mx-auto my-12">
  <div className="h-1 bg-[#97A887] mb-2"></div>
  <div className="h-1 bg-[#BB9F88] mb-2"></div>
  <div className="h-1 bg-[#656E5D]"></div>
</div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#BB9F88] mb-12">
          <h2 className="text-3xl font-serif text-[#99735A] text-center mb-8">Tydlyn</h2>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#97A887] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <div className="ml-4">
                  <p className="font-semibold text-[#67472C]">15:00 - Seremonie</p>
                  <p className="text-[#656E5D]">NG Kerk Brits</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#97A887] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <div className="ml-4">
                  <p className="font-semibold text-[#67472C]">16:30 - Foto Sessie</p>
                  <p className="text-[#656E5D]">Op die Plaas</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#97A887] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                <div className="ml-4">
                  <p className="font-semibold text-[#67472C]">18:00 - Aankoms by Onthaal</p>
                  <p className="text-[#656E5D]">KF49 Citrus Pakhuis</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#97A887] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                <div className="ml-4">
                  <p className="font-semibold text-[#67472C]">18:30 - Ete</p>
                  <p className="text-[#656E5D]">Hoofmaaltyd</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#97A887] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">5</div>
                <div className="ml-4">
                  <p className="font-semibold text-[#67472C]">20:00 - Dansvloer oop</p>
                  <p className="text-[#656E5D]">Party tyd!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Strips - Use between sections */}
<div className="max-w-md mx-auto my-12">
  <div className="h-1 bg-[#97A887] mb-2"></div>
  <div className="h-1 bg-[#BB9F88] mb-2"></div>
  <div className="h-1 bg-[#656E5D]"></div>
</div>

        {/* Locations */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Seremonie */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-[#BB9F88]">
            <h2 className="text-2xl font-serif text-[#99735A] mb-4">Seremonie</h2>
            <div className="space-y-3 text-[#656E5D] mb-4">
              <p className="font-semibold">Datum: 28 Maart 2025</p>
              <p className="font-semibold">Tyd: 15:00</p>
              <p>NG Kerk Brits</p>
              <p>H/V Kerk- en Reitz Straat</p>
              <p>Brits, Noordwes</p>
            </div>
            <div className="h-48 bg-gray-200 rounded-lg">
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
          <div className="bg-white rounded-lg shadow-lg p-6 border border-[#BB9F88]">
            <h2 className="text-2xl font-serif text-[#99735A] mb-4">Onthaal</h2>
            <div className="space-y-3 text-[#656E5D] mb-4">
              <p className="font-semibold">Datum: 28 Maart 2025</p>
              <p className="font-semibold">Tyd: 18:00</p>
              <p>KF49 Citrus Pakhuis</p>
              <p>Kleinfontein</p>
              <p>Brits, Noordwes</p>
            </div>
            <div className="h-48 bg-gray-200 rounded-lg">
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
      </div>
    </div>
  )
}