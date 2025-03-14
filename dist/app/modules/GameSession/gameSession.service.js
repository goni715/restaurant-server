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
exports.updateSessionStatusService = exports.getMyGameSessionsService = exports.createRandomGameSessionService = exports.createFriendGameSessionService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const friend_model_1 = __importDefault(require("../Friend/friend.model"));
const quiz_model_1 = __importDefault(require("../Quiz/quiz.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
const gameSession_model_1 = __importDefault(require("./gameSession.model"));
const createFriendGameSessionService = (loginUserId, opponentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (loginUserId === opponentId) {
        throw new AppError_1.default(409, "This friendId is your id");
    }
    const user = yield user_model_1.default.findById(opponentId);
    if (!user) {
        throw new AppError_1.default(404, "User not found with this friendId");
    }
    //check this user is not already existed in your friend list
    const friend = yield friend_model_1.default.findOne({
        friends: { $all: [loginUserId, opponentId] },
    });
    if (!friend) {
        throw new AppError_1.default(404, "This friendId is not existed in your friend list");
    }
    //get the quizIds
    const data = yield quiz_model_1.default.find({}, "_id").lean();
    const quizIds = data === null || data === void 0 ? void 0 : data.map((quiz) => quiz._id);
    //check gameSession is already existed
    const gameSession = yield gameSession_model_1.default.findOne({
        players: { $all: [loginUserId, opponentId] }
    });
    if (gameSession) {
        throw new AppError_1.default(409, "Game session is already existed");
    }
    // Create a new game session
    const newGameSession = yield gameSession_model_1.default.create({
        players: [loginUserId, opponentId],
        quizzes: quizIds,
        receiverId: opponentId
    });
    return newGameSession;
});
exports.createFriendGameSessionService = createFriendGameSessionService;
const createRandomGameSessionService = (loginUserId, opponentId) => __awaiter(void 0, void 0, void 0, function* () {
    if (loginUserId === opponentId) {
        throw new AppError_1.default(409, "This opponentId is your id");
    }
    const user = yield user_model_1.default.findById(opponentId);
    if (!user) {
        throw new AppError_1.default(404, "User not found with this friendId");
    }
    //check this user is not already existed in your friend list
    const friend = yield friend_model_1.default.findOne({
        friends: { $all: [loginUserId, opponentId] },
    });
    if (friend) {
        throw new AppError_1.default(404, "This opponentId is existed in your friend list");
    }
    //get the quizIds
    const data = yield quiz_model_1.default.find({}, "_id").lean();
    const quizIds = data === null || data === void 0 ? void 0 : data.map((quiz) => quiz._id);
    //check gameSession is already existed
    const gameSession = yield gameSession_model_1.default.findOne({
        players: { $all: [loginUserId, opponentId] }
    });
    if (gameSession) {
        throw new AppError_1.default(409, "Game session is already existed");
    }
    // Create a new game session
    const newGameSession = yield gameSession_model_1.default.create({
        players: [loginUserId, opponentId],
        quizzes: quizIds,
        status: "accepted",
        receiverId: opponentId
    });
    return newGameSession;
});
exports.createRandomGameSessionService = createRandomGameSessionService;
// one by one quiz answer // there will be no friend checking
const updateSessionStatusService = (loginUserId, gameSessionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    //check gameSession does not exist
    const gameSession = yield gameSession_model_1.default.findOne({
        _id: gameSessionId,
        players: { $in: [loginUserId] }
    });
    if (!gameSession) {
        throw new AppError_1.default(409, "Game session Not Found");
    }
    if (loginUserId !== gameSession.receiverId.toString()) {
        throw new AppError_1.default(400, "You have no access to update the status");
    }
    //update the status
    const result = yield gameSession_model_1.default.updateOne({
        _id: new ObjectId(gameSessionId),
        receiverId: loginUserId
    }, {
        status
    });
    return result;
});
exports.updateSessionStatusService = updateSessionStatusService;
const getMyGameSessionsService = (loginUserId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield gameSession_model_1.default.find({
        players: { $in: [loginUserId] },
        status
    });
    return result;
});
exports.getMyGameSessionsService = getMyGameSessionsService;
