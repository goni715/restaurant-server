import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { TableValidFields } from "./table.constant";
import { createTableService, deleteTableService, getTablesByScheduleAndDiningService, getTablesService, updateTableService } from "./table.service";


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
  const validatedQuery = pickValidFields(req.query, TableValidFields);
  const result = await getTablesService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tables are retrieved successfully",
      meta: result.meta,
      data: result.data
    });
});


const getTablesByScheduleAndDining = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { scheduleId, diningId } = req.params;
  const result = await getTablesByScheduleAndDiningService(loginUserId as string, scheduleId, diningId);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tables are retrieved successfully",
      data: result
    });
});


const deleteTable = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { tableId } = req.params;
  const result = await deleteTableService(loginUserId as string, tableId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Table is deleted successfully",
    data: result,
  });
});



const updateTable = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { tableId } = req.params;
  const result = await updateTableService(loginUserId as string, tableId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Table is updated successfully",
    data: result,
  });
});


const TableController = {
    createTable,
    getTables,
    getTablesByScheduleAndDining,
    deleteTable,
    updateTable
};

export default TableController;
