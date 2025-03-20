import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createMenuService, getMenusService } from "./menu.service";


const createMenu = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createMenuService(req, loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Menu is created successfully",
    data: result,
  });
});



const getMenus = catchAsync(async (req, res) => {
  const { restaurantId } = req.params;
  const result = await getMenusService(restaurantId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Menus are retrieved successfully",
    data: result,
  });
});

const MenuController = {
  createMenu,
  getMenus
};

export default MenuController;
