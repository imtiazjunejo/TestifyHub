import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { generateTokn } from "../utils/generateToken.js"; 
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "Student" } = req.body;

  if ([name, email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existedUser = await User.findOne({ email: normalizedEmail });
  if (existedUser) {
    throw new ApiError(409, "Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  const token = generateTokn(newUser._id, res);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token
      },
      "User registered successfully"
    )
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateTokn(user._id, res);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token
      },
      "Login successful"
    )
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  console.log("Cookie has been cleared successfully..");

  return res.status(200).json(new ApiResponse(200, {}, "Logout successfully"));
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  const profileLocalPath = req.file?.path;
  console.log("UPLOAD LOCAL PATH:", profileLocalPath);

  if (!profileLocalPath) {
    throw new ApiError(400, "Profile file is missing");
  }

  const profile = await uploadOnCloudinary(profileLocalPath);

  if (!profile || (!profile.url && !profile.secure_url)) {
    throw new ApiError(400, "Error while uploading profile");
  }

  const imageUrl = profile.secure_url || profile.url;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { profilePic: imageUrl } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile image updated successfully"));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User data retrieved successfully")
  );
});
