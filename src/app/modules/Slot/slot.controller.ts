import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSlotService } from "./slot.service";



const createSlot = catchAsync(async (req, res) => {
  const result = await createSlotService();
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Slot created successfully",
      data: result
    });
});



const SlotController = {
    createSlot
};

export default SlotController;