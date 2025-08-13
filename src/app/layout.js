import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { CartProvider } from "../contexts/CartContext"
import { AuthProvider } from "../contexts/AuthContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata = {
  title: "Kanvei - Premium Quality Products",
  description: "Discover premium quality products with exceptional craftsmanship at Kanvei",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
