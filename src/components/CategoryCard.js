import Link from "next/link"
import Image from "next/image"

export default function CategoryCard({ category }) {
  return (
    <Link href={`/categories/${category._id}`}>
      <div className="group cursor-pointer">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg?height=200&width=300&query=category"}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white text-center px-4" style={{ fontFamily: "Sugar, serif" }}>
                {category.name}
              </h3>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
