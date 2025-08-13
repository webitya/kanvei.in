import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    await connectDB()

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret || typeof jwtSecret !== "string" || jwtSecret.length === 0) {
      console.error("JWT_SECRET environment variable is not properly configured")
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    const body = await request.json()
    const { facebookToken } = body

    if (!facebookToken || typeof facebookToken !== "string" || facebookToken.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Valid Facebook token is required" }, { status: 400 })
    }

    // Verify Facebook token
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${facebookToken.trim()}`,
    )

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

    if (!user || !user._id) {
      console.error("User creation/retrieval failed - no user ID")
      return NextResponse.json({ success: false, error: "Failed to process user data" }, { status: 500 })
    }

    // Ensure user ID is properly formatted
    const userId = user._id.toString ? user._id.toString() : String(user._id)

    if (!userId || userId.length === 0) {
      console.error("Invalid user ID format")
      return NextResponse.json({ success: false, error: "Failed to process user data" }, { status: 500 })
    }

    // Generate JWT token with enhanced error handling
    let token
    try {
      token = jwt.sign(
        {
          userId: userId,
          email: user.email,
        },
        jwtSecret,
        { expiresIn: "7d" },
      )
    } catch (jwtError) {
      console.error("JWT generation failed:", jwtError)
      return NextResponse.json({ success: false, error: "Failed to generate authentication token" }, { status: 500 })
    }

    const userResponse = {
      _id: userId,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      emailVerified: Boolean(user.emailVerified),
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
