import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createFaqService, getSingleFaqService, getAllFaqsService, updateFaqService, deleteFaqService } from './Faq.service';

const createFaq = catchAsync(async (req, res) => {
  const result = await createFaqService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Faq is created successfully',
    data: result,
  });
});

const getSingleFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleFaqService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is retrieved successfully',
    data: result,
  });
});

const getAllFaqs = catchAsync(async (req, res) => {
  const result = await getAllFaqsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateFaqService(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is updated successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteFaqService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is deleted successfully',
    data: result,
  });
});

const FaqController = {
  createFaq,
  getSingleFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
};
export default FaqController;
