import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    await connectDB()
    const { facebookToken } = await request.json()

    if (!facebookToken) {
      return NextResponse.json({ success: false, error: "Facebook token is required" }, { status: 400 })
    }

    // Verify Facebook token
    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${facebookToken}`)
    const facebookUser = await response.json()

    if (!facebookUser.email) {
      return NextResponse.json({ success: false, error: "Failed to get user info from Facebook" }, { status: 400 })
    }

    // Check if user exists
    let user = await User.findOne({ email: facebookUser.email })

    if (!user) {
      // Create new user
      user = await User.create({
        name: facebookUser.name,
        email: facebookUser.email,
        facebookId: facebookUser.id,
        role: "user",
        // No password for OAuth users
      })
    } else if (!user.facebookId) {
      // Link Facebook account to existing user
      user.facebookId = facebookUser.id
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
    console.error("Facebook auth error:", error)
    return NextResponse.json({ success: false, error: "Failed to authenticate with Facebook" }, { status: 500 })
  }
}
