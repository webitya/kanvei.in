import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required for OAuth users
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    // OAuth fields
    googleId: {
      type: String,
      sparse: true,
    },
    facebookId: {
      type: String,
      sparse: true,
    },
    // Email verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ googleId: 1 }, { sparse: true })
UserSchema.index({ facebookId: 1 }, { sparse: true })

export default mongoose.models.User || mongoose.model("User", UserSchema)
