import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { SlotValidFields } from "./slot.constant";
import { createSlotService, deleteSlotService, getSlotDropDownService, getSlotsService } from "./slot.service";



const createSlot = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createSlotService(loginUserId as string, req.body);
  
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Slot is created successfully",
      data: result
    });
});



const getSlots = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, SlotValidFields);
  const result = await getSlotsService(loginUserId as string, validatedQuery);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Slots are retrieved successfully",
      meta: result.meta,
      data: result.data
    });
});


const getSlotDropDown = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getSlotDropDownService(loginUserId as string);
  
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Slots are retrieved successfully",
      data: result
    });
});

const deleteSlot = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { slotId } = req.params;
  const result = await deleteSlotService(loginUserId as string, slotId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Slot is deleted successfully",
    data: result,
  });
});

const SlotController = {
    createSlot,
    getSlots,
    getSlotDropDown,
    deleteSlot
};

export default SlotController;