import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createMenuService } from "./menu.service";


const createMenu = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createMenuService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Menu is created successfully",
    data: result,
  });
});

const MenuController = {
  createMenu
};

export default MenuController;
