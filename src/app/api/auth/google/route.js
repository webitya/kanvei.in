import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    await connectDB()
    const { googleToken } = await request.json()

    if (!googleToken) {
      return NextResponse.json({ success: false, error: "Google token is required" }, { status: 400 })
    }

    // Verify Google token
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleToken}`)
    const googleUser = await response.json()

    if (!googleUser.email) {
      return NextResponse.json({ success: false, error: "Failed to get user info from Google" }, { status: 400 })
    }

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email })

    if (!user) {
      // Create new user
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.id,
        role: "user",
        // No password for OAuth users
      })
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleUser.id
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Remove password from user object
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
    console.error("Google auth error:", error)
    return NextResponse.json({ success: false, error: "Failed to authenticate with Google" }, { status: 500 })
  }
}
