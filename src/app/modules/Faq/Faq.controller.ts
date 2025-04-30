import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createFaqService, updateFaqService, deleteFaqService, getFaqsService } from './Faq.service';

const createFaq = catchAsync(async (req, res) => {
  const result = await createFaqService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Faq is created successfully',
    data: result,
  });
});


const getFaqs = catchAsync(async (req, res) => {
  const result = await getFaqsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faqs are retrieved successfully',
    data:  result
  });
});

const updateFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const result = await updateFaqService(faqId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is updated successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const result = await deleteFaqService(faqId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faq is deleted successfully',
    data: result,
  });
});

const FaqController = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
};
export default FaqController;
