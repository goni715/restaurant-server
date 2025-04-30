import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TPolicyType } from './Policy.interface';
import { createPolicyService, updatePolicyService, getPolicyByTypeService, deletePolicyByTypeService, getPoliciesService } from './Policy.service';

const createPolicy = catchAsync(async (req, res) => {
  const result = await createPolicyService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Policy is created successfully',
    data: result,
  });
});


const getPolicies = catchAsync(async (req, res) => {
  const result = await getPoliciesService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Policies are retrived successfully",
    data: result
  });
});

const getPolicyByType = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await getPolicyByTypeService(type as TPolicyType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is retrieved successfully',
    data: result,
  });
});


const updatePolicy = catchAsync(async (req, res) => {
  const { policyId } = req.params;
  const result = await updatePolicyService(policyId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is updated successfully',
    data: result,
  });
});

const deletePolicyByType = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await deletePolicyByTypeService(type as TPolicyType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is deleted successfully',
    data: result,
  });
});

const PolicyController = {
  createPolicy,
  getPolicies,
  getPolicyByType,
  updatePolicy,
  deletePolicyByType
};
export default PolicyController;
