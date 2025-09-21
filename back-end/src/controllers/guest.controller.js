import { ApiResponse } from "../utils/index.utils.js";

// Guest mode controller - provides basic functionality without authentication
const getGuestInfo = (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          message: "Guest mode is active",
          features: [
            "Local todo storage",
            "Basic todo operations",
            "No data persistence across devices",
          ],
          limitations: [
            "Data stored locally only",
            "No cloud sync",
            "No advanced features",
          ],
        },
        "Guest mode information"
      )
    );
};

export { getGuestInfo };
