"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/placeholder.svg?height=400&width=800&text=Jewellery Collection",
      link: "/jewellery",
      bgColor: "bg-gradient-to-r from-[#5A0117] to-[#8C6141]",
    },
    {
      image: "/placeholder.svg?height=400&width=800&text=Fashion Collection",
      link: "/womens-wear",
      bgColor: "bg-gradient-to-r from-[#DBCCB7] to-[#8C6141]",
    },
    {
      image: "/placeholder.svg?height=400&width=800&text=Electronics Collection",
      link: "/electronics",
      bgColor: "bg-gradient-to-r from-[#AFABAA] to-[#5A0117]",
    },
    {
      image: "/placeholder.svg?height=400&width=800&text=Beauty Collection",
      link: "/cosmetics",
      bgColor: "bg-gradient-to-r from-[#8C6141] to-[#5A0117]",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-[190px] sm:h-[280px] md:h-[320px] lg:h-[360px] overflow-hidden">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link href={slide.link} className="block w-full h-full cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className={`absolute inset-0 ${slide.bgColor} opacity-70`}></div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#DBCCB7] bg-opacity-80 rounded-full flex items-center justify-center text-[#5A0117] hover:bg-opacity-100 transition-all duration-200 z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#DBCCB7] bg-opacity-80 rounded-full flex items-center justify-center text-[#5A0117] hover:bg-opacity-100 transition-all duration-200 z-20"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-[#DBCCB7] scale-125" : "bg-[#DBCCB7] bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
