"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableBookingService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const table_model_1 = __importDefault(require("../Table/table.model"));
const tableBooking_model_1 = __importDefault(require("./tableBooking.model"));
const createTableBookingService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, tableId, guest } = payload;
    const table = yield table_model_1.default.findOne({
        _id: tableId,
        ownerId: loginUserId
    });
    if (!table) {
        throw new AppError_1.default(404, "Table Not found");
    }
    //check availableSeats
    const availableSeats = table.seats;
    if (availableSeats < guest) {
        throw new AppError_1.default(400, "There are no available seats in this table at this moment");
    }
    //transaction & rollback part
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //database-process-01
        //create the tableBooking
        const newBooking = yield tableBooking_model_1.default.create([{
                name,
                guest,
                tableId,
                scheduleId: table.scheduleId,
                restaurantId: table.restaurantId,
                diningId: table.diningId,
            }], { session });
        //database-process-02
        //update the table
        yield table_model_1.default.updateOne({ _id: tableId, seats: { $gt: 0 } }, { $inc: { seats: -guest } }, // Decrease availableSeats
        { session });
        yield session.commitTransaction();
        yield session.endSession();
        return newBooking[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.createTableBookingService = createTableBookingService;
