import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createTableService, getTablesService } from "./table.service";


const createTable = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createTableService(loginUserId as string, req.body);
  
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Table is created successfully",
      data: result
    });
});


const getTables = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { scheduleId, diningId } = req.params;
  const result = await getTablesService(loginUserId as string, scheduleId, diningId);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tables are retrieved successfully",
      data: result
    });
});


const TableController = {
    createTable,
    getTables
};

export default TableController;
