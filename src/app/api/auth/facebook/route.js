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
    const { facebookToken } = body

    if (!facebookToken || typeof facebookToken !== "string") {
      return NextResponse.json({ success: false, error: "Valid Facebook token is required" }, { status: 400 })
    }

    // Verify Facebook token
    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${facebookToken}`)

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Invalid Facebook token" }, { status: 400 })
    }

    const facebookUser = await response.json()

    if (!facebookUser.email || !facebookUser.id) {
      return NextResponse.json({ success: false, error: "Failed to get user info from Facebook" }, { status: 400 })
    }

    // Check if user exists
    let user = await User.findOne({ email: facebookUser.email })

    if (!user) {
      // Create new user
      user = await User.create({
        name: facebookUser.name || facebookUser.email.split("@")[0],
        email: facebookUser.email,
        facebookId: facebookUser.id,
        role: "user",
        emailVerified: true, // Facebook emails are verified
      })
    } else if (!user.facebookId) {
      // Link Facebook account to existing user
      user.facebookId = facebookUser.id
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
    console.error("Facebook auth error:", error)
    return NextResponse.json({ success: false, error: "Failed to authenticate with Facebook" }, { status: 500 })
  }
}
