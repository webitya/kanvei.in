import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    })

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
