/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { ReservationSearchableFields } from './Reservation.constant';
import { IReservation, IReservationPayload, TReservationQuery } from './Reservation.interface';
import ReservationModel from './Reservation.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import ScheduleModel from '../Schedule/schedule.model';
import RestaurantModel from '../Restaurant/restaurant.model';

const createReservationService = async (
  loginUserId: string,
  payload: IReservationPayload,
) => {
  const { scheduleIds, seats} = payload;

   //check restaurant
   const restaurant = await RestaurantModel.findOne({
    ownerId:loginUserId
  });

  if (!restaurant) {
    throw new AppError(404, "Restaurant Not Found");
  }

  let scheduleIdsArray = [];
  for(let i =0; i < scheduleIds.length; i++){
     const schedule = await ScheduleModel.findOne({
        ownerId: loginUserId,
        _id: scheduleIds[i]
     });
     if(schedule){
      scheduleIdsArray.push(scheduleIds[i])
     }
  }



  let reservationData = [];
  for(let i =0; i < scheduleIdsArray.length; i++){
     const reservation = await ReservationModel.findOne({
        ownerId: loginUserId,
        _id: scheduleIdsArray[i]
     });
     if(!reservation){
      reservationData.push({
        scheduleId: scheduleIdsArray[i],
        ownerId: loginUserId,
        restaurantId: restaurant?._id,
        seats
      })
     }
  }

  const result = await ReservationModel.insertMany(reservationData);
  return result;
};

const getAllReservationsService = async (query: TReservationQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, ReservationSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ReservationModel.aggregate([
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
  const totalReviewResult = await ReservationModel.aggregate([
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

const getSingleReservationService = async (id: string) => {
  const result = await ReservationModel.findById(id);
  if (!result) {
    throw new AppError(404, 'Reservation Not Found');
  }

  return result;
};

const updateReservationService = async (reservationId: string, payload: any) => {
 
  const reservation = await ReservationModel.findById(reservationId);
  if(!reservation){
    throw new AppError(404, "Reservation Not Found");
  }
  const result = await ReservationModel.updateOne(
    { _id: reservationId },
    payload,
  );

  return result;
};

const deleteReservationService = async (id: string) => {
  const deletedService = await ReservationModel.deleteOne({ _id:id });

  if (!deletedService) {
    throw new AppError(400, 'Failed to delete Reservation');
  }

  return deletedService;
};

export {
  createReservationService,
  getAllReservationsService,
  getSingleReservationService,
  updateReservationService,
  deleteReservationService,
};
