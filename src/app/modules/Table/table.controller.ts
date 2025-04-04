import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createTableService } from "./table.service";


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


const TableController = {
    createTable
};

export default TableController;
