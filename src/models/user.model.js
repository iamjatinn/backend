import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
  
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

/*
SUMMARY (for future revision):

1. pre("save"):
   - Automatically hashes the user's password before saving it to the database.
   - Uses isModified("password") to avoid re-hashing already hashed passwords.

2. isPasswordCorrect():
   - Compares a plain-text password with the stored hashed password.
   - Used during login to verify user credentials.

3. generateAccessToken():
   - Creates a short-lived JWT access token.
   - Contains user information required for authorization.
   - Uses ACCESS_TOKEN_SECRET and expiry from environment variables.

4. generateRefreshToken():
   - Creates a long-lived JWT refresh token.
   - Contains minimal data (user ID only) for security.
   - Used to generate new access tokens without re-login.

Overall:
- All authentication logic is encapsulated inside the User model.
- Follows OOP principles (encapsulation + abstraction).
- Ensures secure password handling and token-based authentication.
*/

export const User = mongoose.model("User", userSchema);
