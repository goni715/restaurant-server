import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createReservationService, getSingleReservationService, getAllReservationsService, updateReservationService, deleteReservationService } from './Reservation.service';

const createReservation = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createReservationService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Reservation created successfully',
    data: result,
  });
});

const getSingleReservation = catchAsync(async (req, res) => {
  const { reservationId } = req.params;
  const result = await getSingleReservationService(reservationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservation is retrieved successfully',
    data: result,
  });
});

const getAllReservations = catchAsync(async (req, res) => {
  const result = await getAllReservationsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateReservation = catchAsync(async (req, res) => {
  const { ireservationId } = req.params;
  const result = await updateReservationService(reservationId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservation is updated successfully',
    data: result,
  });
});

const deleteReservation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteReservationService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservation is deleted successfully',
    data: result,
  });
});

const ReservationController = {
  createReservation,
  getSingleReservation,
  getAllReservations,
  updateReservation,
  deleteReservation,
};
export default ReservationController;
