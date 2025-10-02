import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF7E3]">
      <div className="text-center py-12 px-4">
        <h1 className="text-6xl font-serif text-[#67472C] mb-4">Nickie & Chane</h1>
        <p className="text-2xl text-[#99735A] mb-6">28 Maart 2025</p>
        <p className="text-xl text-[#656E5D] mb-8">#thunderMerweFees</p>
        
        {/* Main Photo - simplified */}
        <div className="max-w-4xl mx-auto mt-8 mb-12">
          <Image 
            src="/hoof-foto.jpg" 
            alt="Nickie en Chane"
            width={800}
            height={500}
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>

        <div className="max-w-md mx-auto">
          <div className="h-1 bg-[#97A887] mb-2"></div>
          <div className="h-1 bg-[#BB9F88] mb-2"></div>
          <div className="h-1 bg-[#656E5D]"></div>
        </div>
      </div>
    </main>
  )
}