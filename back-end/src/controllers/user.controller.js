import { User } from "./../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  uploadOnCloudinary,
} from "./../utils/index.utils.js";
const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("❌ Token generation error:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, password } = req.body;

  if (
    [fullName, username, password].some(
      (field) => String(field || "").trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }

  const existedUser = await User.findOne({ username });

  if (existedUser) {
    throw new ApiError(409, "User with Username already exists");
  }

  const avatarLocalPath = req.file?.path;

  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(500, "Something went wrong while uploading Avatar");
    }
  }

  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "username is required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, "User not Found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const loggedOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logout Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorised request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token either expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Please Provide Full Name");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, {}, "User not found or already deleted.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User Deleted Successfully"));
});

export {
  registerUser,
  loginUser,
  loggedOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  deleteAccount,
};
