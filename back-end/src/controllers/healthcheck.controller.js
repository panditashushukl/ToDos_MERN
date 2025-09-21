import { asyncHandler, ApiResponse } from "./../utils/index.utils.js";

const healthcheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "API is healthy, Server is running fine"));
});

export { healthcheck };
