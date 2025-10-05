'use client'
import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const weddingDate = new Date('2026-03-28T14:00:00')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-[80vw] md:max-w-[60vw] mx-auto w-full">
      <h3 className="text-xl sm:text-2xl md:text-3xl text-[#3d251e] text-center mb-4 sm:mb-6 font-bold">
        Amptelik net nog
      </h3>

      <div className="flex flex-row justify-between gap-2 sm:gap-3 md:gap-4">
        <div className="flex-1 text-center min-w-0">
          <div className="bg-[#E8DBC5] rounded-lg p-3 sm:p-4 md:p-6 border border-[#BB9F88] aspect-square flex flex-col items-center justify-center">
            <div className="text-lg sm:text-2xl md:text-4xl font-bold text-[#3d251e] mb-1 sm:mb-2 leading-tight">
              {timeLeft.days}
            </div>
            <div className="text-xs md:text-xl md:text-base text-[#5c4033] font-medium whitespace-nowrap">
              Dae
            </div>
          </div>
        </div>

        <div className="flex-1 text-center min-w-0">
          <div className="bg-[#E8DBC5] rounded-lg p-3 sm:p-4 md:p-6 border border-[#BB9F88] aspect-square flex flex-col items-center justify-center">
            <div className="text-lg md:text-4xl font-bold text-[#3d251e] mb-1 sm:mb-2 leading-tight">
              {timeLeft.hours}
            </div>
            <div className="text-xs md:text-xl md:text-base text-[#5c4033] font-medium whitespace-nowrap">
              Ure
            </div>
          </div>
        </div>

        <div className="flex-1 text-center min-w-0">
          <div className="bg-[#E8DBC5] rounded-lg p-3 sm:p-4 md:p-6 border border-[#BB9F88] aspect-square flex flex-col items-center justify-center">
            <div className="text-lg md:text-4xl font-bold text-[#3d251e] mb-1 sm:mb-2 leading-tight">
              {timeLeft.minutes}
            </div>
            <div className="text-xs md:text-xl md:text-base text-[#5c4033] font-medium whitespace-nowrap">
              Minute
            </div>
          </div>
        </div>

        <div className="flex-1 text-center min-w-0">
          <div className="bg-[#E8DBC5] rounded-lg p-3 sm:p-4 md:p-6 border border-[#BB9F88] aspect-square flex flex-col items-center justify-center">
            <div className="text-lg md:text-4xl font-bold text-[#3d251e] mb-1 sm:mb-2 leading-tight">
              {timeLeft.seconds}
            </div>
            <div className="text-xs md:text-xl md:text-base text-[#5c4033] font-medium whitespace-nowrap">
              Sekondes
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl text-[#3d251e] text-center mb-4 sm:mb-6 font-bold">
          tot 28 Maart 2026
        </h3>
      </div>
    </div>
  )
}