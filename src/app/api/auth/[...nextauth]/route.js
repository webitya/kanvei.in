import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import bcrypt from "bcryptjs"
import User from "../../../../lib/models/User"
import connectDB from "../../../../lib/mongodb" 


export const authOptions = {
  providers: [
    // 1️⃣ Custom Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials
          
          if (!email || !password) {
            return null
          }

          await connectDB()

          const user = await User.findOne({ email })
          if (!user) {
            console.log("User not found:", email)
            return null
          }

          // Check if user has a password (for OAuth users)
          if (!user.password) {
            console.log("User registered via OAuth, cannot login with credentials:", email)
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            console.log("Invalid password for user:", email)
            return null
          }

          console.log("✅ User authenticated successfully:", email)
          return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name,
            role: user.role,
            phone: user.phone 
          }
        } catch (error) {
          console.error("❌ Authorization error:", error)
          return null
        }
      },
    }),

    // 2️⃣ Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // 3️⃣ Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // Login ke baad redirect URLs
    async redirect({ url, baseUrl }) {
      // Login ke baad home page redirect karna
      if (url === baseUrl || url === `${baseUrl}/login` || url === `${baseUrl}/register`) {
        return `${baseUrl}/`
      }
      // Agar already valid URL hai to wahi return kar do
      if (url.startsWith(baseUrl)) {
        return url
      }
      return `${baseUrl}/`
    },

    // Jab user login karta hai (custom / google / facebook sabke liye chalega)
    async signIn({ user, account, profile }) {
      try {
        console.log("🟢 signIn callback: ", { user, account, profile })

        await connectDB()

        // DB me user save ya update
        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          console.log("🆕 Creating new user:", user.email)
          
          // Create new user based on provider
          const userData = {
            name: user.name || profile?.name || "Unknown User",
            email: user.email,
            emailVerified: true, // OAuth users are pre-verified
          }

          // Add provider-specific fields
          if (account.provider === "google") {
            userData.googleId = account.providerAccountId
          } else if (account.provider === "facebook") {
            userData.facebookId = account.providerAccountId
          }

          await User.create(userData)
        } else {
          console.log("👤 Existing user found:", user.email)
          
          // Update provider IDs if not already set
          const updateData = {}
          if (account.provider === "google" && !existingUser.googleId) {
            updateData.googleId = account.providerAccountId
          } else if (account.provider === "facebook" && !existingUser.facebookId) {
            updateData.facebookId = account.providerAccountId
          }

          if (Object.keys(updateData).length > 0) {
            await User.findOneAndUpdate({ email: user.email }, updateData)
          }
        }

        return true // allow login
      } catch (error) {
        console.error("❌ signIn callback error:", error)
        return false // deny login on error
      }
    },

    // JWT token me data add karna
    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.role = dbUser.role
          token.phone = dbUser.phone
        }
      }
      return token
    },

    // frontend ke session object me extra data inject karna
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.phone = token.phone
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
