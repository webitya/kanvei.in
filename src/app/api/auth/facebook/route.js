import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import jwt from "jsonwebtoken"

export async function POST(request) {
  if (!request || typeof request.json !== "function") {
    return NextResponse.json({ success: false, error: "Invalid request context" }, { status: 400 })
  }

  try {
    await connectDB()

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret || typeof jwtSecret !== "string" || jwtSecret.length === 0) {
      console.error("JWT_SECRET environment variable is not properly configured")
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const { facebookToken } = body || {}

    if (
      !facebookToken ||
      typeof facebookToken !== "string" ||
      !facebookToken?.trim() ||
      facebookToken.trim().length === 0
    ) {
      return NextResponse.json({ success: false, error: "Valid Facebook token is required" }, { status: 400 })
    }

    const trimmedToken = facebookToken.trim()

    let response
    try {
      response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(trimmedToken)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      )
    } catch (fetchError) {
      console.error("Facebook API fetch error:", fetchError)
      return NextResponse.json({ success: false, error: "Failed to verify Facebook token" }, { status: 500 })
    }

    if (!response?.ok) {
      return NextResponse.json({ success: false, error: "Invalid Facebook token" }, { status: 400 })
    }

    let facebookUser
    try {
      facebookUser = await response.json()
    } catch (jsonError) {
      console.error("Facebook response parsing error:", jsonError)
      return NextResponse.json({ success: false, error: "Invalid response from Facebook" }, { status: 500 })
    }

    if (!facebookUser?.email || !facebookUser?.id) {
      return NextResponse.json({ success: false, error: "Failed to get user info from Facebook" }, { status: 400 })
    }

    let user
    try {
      user = await User.findOne({ email: facebookUser.email })
    } catch (dbError) {
      console.error("Database query error:", dbError)
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 })
    }

    if (!user) {
      // Create new user
      try {
        const userName = facebookUser?.name || (facebookUser?.email ? facebookUser.email.split("@")[0] : "User")
        user = await User.create({
          name: userName,
          email: facebookUser.email,
          facebookId: facebookUser.id,
          role: "user",
          emailVerified: true, // Facebook emails are verified
        })
      } catch (createError) {
        console.error("User creation error:", createError)
        return NextResponse.json({ success: false, error: "Failed to create user account" }, { status: 500 })
      }
    } else if (!user.facebookId) {
      // Link Facebook account to existing user
      try {
        user.facebookId = facebookUser.id
        user.emailVerified = true
        await user.save()
      } catch (updateError) {
        console.error("User update error:", updateError)
        return NextResponse.json({ success: false, error: "Failed to update user account" }, { status: 500 })
      }
    }

    if (!user?._id) {
      console.error("User creation/retrieval failed - no user ID")
      return NextResponse.json({ success: false, error: "Failed to process user data" }, { status: 500 })
    }

    let userId
    try {
      if (user._id?.toString) {
        userId = user._id.toString()
      } else if (user._id) {
        userId = String(user._id)
      } else {
        throw new Error("No user ID available")
      }
    } catch (idError) {
      console.error("User ID formatting error:", idError)
      return NextResponse.json({ success: false, error: "Failed to process user data" }, { status: 500 })
    }

    if (!userId || typeof userId !== "string" || userId.length === 0) {
      console.error("Invalid user ID format:", userId)
      return NextResponse.json({ success: false, error: "Failed to process user data" }, { status: 500 })
    }

    let token
    try {
      const payload = {
        userId: userId,
        email: user?.email || facebookUser.email,
      }

      const options = { expiresIn: "7d" }

      token = jwt.sign(payload, jwtSecret, options)

      if (!token || typeof token !== "string") {
        throw new Error("Invalid token generated")
      }
    } catch (jwtError) {
      console.error("JWT generation failed:", jwtError)
      return NextResponse.json({ success: false, error: "Failed to generate authentication token" }, { status: 500 })
    }

    const userResponse = {
      _id: userId,
      name: user?.name || facebookUser?.name || "",
      email: user?.email || facebookUser?.email || "",
      role: user?.role || "user",
      emailVerified: Boolean(user?.emailVerified),
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

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
