"use client"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import NavbarDrawer from "./NavbarDrawer"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isClothingDropdownOpen, setIsClothingDropdownOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { getCartItemsCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <>
      <header style={{ backgroundColor: "#5A0117" }} className="text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "Sugar, serif" }}>
                Kanvei
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Shop
              </Link>
              <Link
                href="/jewellery"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Jewellery
              </Link>
              <Link
                href="/stationery"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Stationery
              </Link>
              <Link
                href="/cosmetics"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Cosmetics
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsClothingDropdownOpen(!isClothingDropdownOpen)}
                  className="hover:opacity-80 transition-opacity flex items-center gap-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Clothing
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isClothingDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/mens-wear"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setIsClothingDropdownOpen(false)}
                    >
                      Mens Wear
                    </Link>
                    <Link
                      href="/womens-wear"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setIsClothingDropdownOpen(false)}
                    >
                      Womens Wear
                    </Link>
                    <Link
                      href="/kids-wear"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setIsClothingDropdownOpen(false)}
                    >
                      Kids Wear
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/electronics"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Electronics
              </Link>
              <Link
                href="/contact"
                className="hover:opacity-80 transition-opacity"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Contact
              </Link>
            </nav>

            {/* Cart and User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Link href="/wishlist" className="hover:opacity-80 transition-opacity">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>
              )}

              <Link href="/cart" className="hover:opacity-80 transition-opacity relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                {getCartItemsCount() > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                    style={{ backgroundColor: "#8C6141", fontFamily: "Montserrat, sans-serif" }}
                  >
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#8C6141" }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block">{user?.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                        >
                          {user?.name}
                        </p>
                        <p className="text-xs" style={{ color: "#8C6141", fontFamily: "Montserrat, sans-serif" }}>
                          {user?.email}
                        </p>
                      </div>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                          style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>

                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>

                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Wishlist
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hover:opacity-80 transition-opacity hidden md:block"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Login
                </Link>
              )}

              <button onClick={() => setIsDrawerOpen(true)} className="md:hidden p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <NavbarDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
