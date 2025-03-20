import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { MenuValidFields } from "./menu.constant";
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
  const validatedQuery = pickValidFields(req.query, MenuValidFields);
  const result = await getMenusService(restaurantId, validatedQuery);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Menus are retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const MenuController = {
  createMenu,
  getMenus
};

export default MenuController;
