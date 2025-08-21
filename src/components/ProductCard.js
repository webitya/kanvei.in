import Link from "next/link"
import Image from "next/image"

export default function ProductCard({ product }) {   
    
  console.log("ProductCard rendered for:", product);
   
  return (
    <div className="group cursor-pointer">
      <Link href={`/products/${product.slug}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.images?.[0] || "/placeholder.svg?height=300&width=300&query=product"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.featured && (
              <div
                className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded"
                style={{ backgroundColor: "#8C6141", fontFamily: "Montserrat, sans-serif" }}
              >
                Featured
              </div>
            )}
          </div>

          <div className="p-4">
            <h3
              className="text-lg font-semibold mb-2 group-hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}
            >
              {product.name}
            </h3>
            <p className="text-sm mb-3 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}>
                ₹{product.price}
              </span>
              <span className="text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#AFABAA" }}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
