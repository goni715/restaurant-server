import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { UserValidFields } from '../User/user.constant';
import { createOwnerService, deleteOwnerService, getOwnersService, updateOwnerService,  } from './Owner.service';

const createOwner = catchAsync(async (req, res) => {
  const result = await createOwnerService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Owner is created successfully",
    data: result
  })
})

const getOwners = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, UserValidFields);
  const result = await getOwnersService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Owners are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});



const updateOwner = catchAsync(async (req, res) => {
  const { ownerId } = req.params
  const result = await updateOwnerService(ownerId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Owner is updated successfully",
    data: result
  });
});


const deleteOwner = catchAsync(async (req, res) => {
  const { ownerId } = req.params;
  const result = await deleteOwnerService(ownerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Owner is deleted successfully",
    data: result
  });
});

const OwnerController = {
  createOwner,
  getOwners,
  updateOwner,
  deleteOwner
};
export default OwnerController;
