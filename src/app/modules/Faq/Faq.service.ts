/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { FaqSearchableFields } from './Faq.constant';
import mongoose from 'mongoose';
import { IFaq, TFaqQuery } from './Faq.interface';
import FaqModel from './Faq.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';

const createFaqService = async (
  payload: IFaq,
) => {
  const result = await FaqModel.create(payload);
  
  if (!result) {
    throw new AppError(400, 'Failed to create Faq');
  }

  return result;
};

const getAllFaqsService = async (query: TFaqQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, FaqSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await FaqModel.aggregate([
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender:1,
        role: 1,
        status: 1,
        profileImg: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalReviewResult = await FaqModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getSingleFaqService = async (id: string) => {
  const result = await FaqModel.findById(id);
  if (!result) {
    throw new AppError(404, 'Faq Not Found');
  }

  return result;
};

const updateFaqService = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('faqs')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('Faq not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted Faq');
  }

  const updatedData = await FaqModel.updateOne(
    { _id: id },
    payload,
  );



  return updatedData;
};

const deleteFaqService = async (id: string) => {
  const deletedService = await FaqModel.deleteOne({ _id:id });

  if (!deletedService) {
    throw new AppError(400, 'Failed to delete Faq');
  }

  return deletedService;
};

export {
  createFaqService,
  getAllFaqsService,
  getSingleFaqService,
  updateFaqService,
  deleteFaqService,
};
