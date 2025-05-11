import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createReservationService, getSingleReservationService, updateReservationService, deleteReservationService, getReservationsService, getReservationsByDateService } from './Reservation.service';

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

const getReservations = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getReservationsService(loginUserId as string,req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getReservationsByDate = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { date } = req.params;
  const result = await getReservationsByDateService(loginUserId as string, date);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations are retrieved successfully',
    data: result
  });
});

const updateReservation = catchAsync(async (req, res) => {
  const { reservationId } = req.params;
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
  getReservations,
  getReservationsByDate,
  updateReservation,
  deleteReservation,
};
export default ReservationController;
