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
exports.getMyGameSessions = exports.updateSessionStatus = exports.createRandomGameSession = exports.createFriendGameSession = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const gameSession_service_1 = require("./gameSession.service");
const createFriendGameSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { opponentId } = req.body;
    const result = yield (0, gameSession_service_1.createFriendGameSessionService)(loginUserId, opponentId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Game Session is created successfully",
        data: result,
    });
}));
exports.createFriendGameSession = createFriendGameSession;
const createRandomGameSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { opponentId } = req.body;
    const result = yield (0, gameSession_service_1.createRandomGameSessionService)(loginUserId, opponentId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Game Session is created successfully",
        data: result,
    });
}));
exports.createRandomGameSession = createRandomGameSession;
const updateSessionStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { gameSessionId } = req.params;
    const { status } = req.body;
    const result = yield (0, gameSession_service_1.updateSessionStatusService)(loginUserId, gameSessionId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Game Session is accepeted successfully",
        data: result,
    });
}));
exports.updateSessionStatus = updateSessionStatus;
const getMyGameSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { status } = req.params;
    const result = yield (0, gameSession_service_1.getMyGameSessionsService)(loginUserId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Game Sessions are retrieved successfully",
        data: result
    });
}));
exports.getMyGameSessions = getMyGameSessions;
