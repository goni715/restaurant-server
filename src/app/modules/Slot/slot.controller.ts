import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSlotService, getSlotsService } from "./slot.service";



const createSlot = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createSlotService(loginUserId as string, req.body);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Slot is created successfully",
      data: result
    });
});



const getSlots = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getSlotsService(loginUserId as string);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Slots are retrieved successfully",
      data: result
    });
});


const SlotController = {
    createSlot,
    getSlots
};

export default SlotController;