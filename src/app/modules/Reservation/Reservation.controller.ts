import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createReservationService, updateReservationService, deleteReservationService, getReservationsService, getReservationsByDateService, getUserReservationsByDateService,  getDiningsByRestaurantIdAndScheduleIdService, getSeatsByDiningIdService } from './Reservation.service';


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



const getUserReservationsByDate = catchAsync(async (req, res) => {
  const { restaurantId, date } = req.params;
  const result = await getUserReservationsByDateService(restaurantId, date);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations are retrieved successfully',
    data: result
  });
});



const getDiningsByRestaurantIdAndScheduleId = catchAsync(async (req, res) => {
  const { restaurantId, scheduleId } = req.params;
  const result = await getDiningsByRestaurantIdAndScheduleIdService(restaurantId, scheduleId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations are retrieved successfully',
    data: result
  });
});


const getSeatsByDiningId = catchAsync(async (req, res) => {
  const { diningId } = req.params;
  const result = await getSeatsByDiningIdService(diningId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservations are retrieved successfully',
    data: result
  });
});

const updateReservation = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { reservationId } = req.params;
  const result = await updateReservationService(loginUserId as string,reservationId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservation is updated successfully',
    data: result,
  });
});

const deleteReservation = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { reservationId } = req.params;
  const result = await deleteReservationService(loginUserId as string,reservationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reservation is deleted successfully',
    data: result,
  });
});

const ReservationController = {
  createReservation,
  getReservations,
  getReservationsByDate,
  getUserReservationsByDate,
  getDiningsByRestaurantIdAndScheduleId,
  getSeatsByDiningId,
  updateReservation,
  deleteReservation,
};
export default ReservationController;
