import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

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
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
