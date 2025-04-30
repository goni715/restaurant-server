/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { IFaq } from './Faq.interface';
import FaqModel from './Faq.model';
import slugify from 'slugify';

const createFaqService = async (
  payload: IFaq,
) => {
  const { question } = payload;
  const slug = slugify(question).toLowerCase();
  payload.slug=slug;

  //check faq is already exist
  const faq = await FaqModel.findOne({ slug });
  if(faq){
    throw new AppError(409, "This question is already existed");
  }

  const result = await FaqModel.create(payload);
  
  return result;
};


const getFaqsService = async () => {
  const result = await FaqModel.aggregate([
    {
      $project: {
        category:0,
        isActive:0,
        slug:0
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);
  return result;
}



const updateFaqService = async (faqId: string, payload: Partial<IFaq>) => {
  const faq = await FaqModel.findById(faqId);
  if(!faq){
    throw new AppError(404, "Faq Not Found");
  }

  if(payload?.question){
    const slug = slugify(payload.question).toLowerCase();
    payload.slug = slug;
    const faqExist = await FaqModel.findOne({
      _id: { $ne: faqId },
      slug
    });
    if (faqExist) {
      throw new AppError(409, "Sorry! This Question is already existed");
    }
  }

  const result = await FaqModel.updateOne(
    { _id: faqId },
    payload,
  );

  return result;
};

const deleteFaqService = async (faqId: string) => {
  const faq = await FaqModel.findById(faqId);
  if(!faq){
    throw new AppError(404, "Faq Not Found");
  }

  const result = await FaqModel.deleteOne({ _id: faqId });
  return result;
};

export {
  createFaqService,
  getFaqsService,
  updateFaqService,
  deleteFaqService,
};
