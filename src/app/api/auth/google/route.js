import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    await connectDB()

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set")
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    const body = await request.json()
    const { googleToken } = body

    if (!googleToken || typeof googleToken !== "string") {
      return NextResponse.json({ success: false, error: "Valid Google token is required" }, { status: 400 })
    }

    // Verify Google token
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`)

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Invalid Google token" }, { status: 400 })
    }

    const googleUser = await response.json()

    if (!googleUser.email || !googleUser.id) {
      return NextResponse.json({ success: false, error: "Failed to get user info from Google" }, { status: 400 })
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email })

    if (!user) {
      // Create new user
      user = await User.create({
        name: googleUser.name || googleUser.email.split("@")[0],
        email: googleUser.email,
        googleId: googleUser.id,
        role: "user",
        emailVerified: true, // Google emails are verified
      })
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleUser.id
      user.emailVerified = true
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // Remove sensitive data from user object
    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ success: false, error: "Failed to authenticate with Google" }, { status: 500 })
  }
}
