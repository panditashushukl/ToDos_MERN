import { verifyJWT } from "./../middlewares/auth.middleware.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { Router } from "express";
import {
  registerUser,
  loginUser,
  loggedOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
} from "./../controllers/user.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

//secured Route
router.route("/logout").post(verifyJWT, loggedOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
