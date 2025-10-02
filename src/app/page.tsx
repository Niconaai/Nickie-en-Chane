import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#E8DBC5]">
      <div className="text-center py-12 px-4">
        <h1 className="text-6xl text-[#67472C] mb-4">Nickie & Chane</h1>
        {/* Decorative Strips - Use between sections */}
<div className="max-w-md mx-auto my-12">
  <div className="h-1 bg-[#97A887] mb-2"></div>
  <div className="h-1 bg-[#BB9F88] mb-2"></div>
  <div className="h-1 bg-[#656E5D]"></div>
</div>
        <p className="text-2xl text-[#99735A] mb-6">28 Maart 2026</p>
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

        
      </div>
    </main>
  )
}