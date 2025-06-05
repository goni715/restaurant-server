/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errors/AppError";
import { PolicyTypeArray } from "./Policy.constant";
import { IPolicy, TPolicyType } from "./Policy.interface";
import PolicyModel from "./Policy.model";

const createPolicyService = async (payload: IPolicy) => {
  //check policy is already exists
  const policy = await PolicyModel.findOne({ type: payload.type });
  if (policy) {
    throw new AppError(409, `${payload.type} is already existed !`);
  }

  const result = await PolicyModel.create(payload);
  return result;
};

const getPoliciesService = async () => {
  const result = await PolicyModel.find()
    .select("-createdAt -updatedAt")
    .sort("-createdAt");
  return result;
};

const getPolicyByTypeService = async (type: TPolicyType) => {
  //check type is not valid
  if (!PolicyTypeArray.includes(type)) {
    throw new AppError(
      400,
      `Please provide valid Type-- 'privacy-policy' or 'terms-condition' or 'about-us' `
    );
  }

  const result = await PolicyModel.findOne({ type });
  if (!result) {
    throw new AppError(404, "Policy Not Found");
  }
  return result;
};

const updatePolicyByTypeService = async (
  type: TPolicyType,
  payload: Partial<IPolicy>
) => {
  //check type is not valid
  if (!PolicyTypeArray.includes(type)) {
    throw new AppError(
      400,
      `Please provide valid Type-- 'privacy-policy' or 'terms-condition' or 'about-us' `
    );
  }

  const policy = await PolicyModel.findOne({ type });
  if (!policy) {
    throw new AppError(404, "Policy Not Found");
  }

  if (payload?.type) {
    const policyExist = await PolicyModel.findOne({
      type: { $ne: type },
    });
    if (policyExist) {
      throw new AppError(409, `Sorry! ${payload.type} is already existed`);
    }
  }
  const result = await PolicyModel.updateOne({ type }, payload);
  return result;
};

const deletePolicyByTypeService = async (type: TPolicyType) => {
  //check type is not valid
  if (!PolicyTypeArray.includes(type)) {
    throw new AppError(
      400,
      `Please provide valid Type-- "privacy-policy" or "terms-condition" or "about-us" `
    );
  }

  const policy = await PolicyModel.findOne({ type });
  if (!policy) {
    throw new AppError(404, `${type} Not Found`);
  }

  //delete the policy
  const result = await PolicyModel.deleteOne({ _id: policy._id });
  return result;
};

export {
  createPolicyService,
  getPoliciesService,
  getPolicyByTypeService,
  updatePolicyByTypeService,
  deletePolicyByTypeService,
};
