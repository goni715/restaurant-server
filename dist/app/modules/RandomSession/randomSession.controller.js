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
exports.removeRandomPlayer = exports.acceptRandomPlayer = exports.getRandomSessions = exports.createRandomSession = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const randomSession_constant_1 = require("./randomSession.constant");
const randomSession_service_1 = require("./randomSession.service");
const createRandomSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, randomSession_service_1.createRandomSessionService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Random Game Session is created successfully",
        data: result,
    });
}));
exports.createRandomSession = createRandomSession;
const getRandomSessions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, randomSession_constant_1.RandomSessionValidFields);
    const result = yield (0, randomSession_service_1.getRandomSesssionsService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Random Sessions are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
exports.getRandomSessions = getRandomSessions;
const acceptRandomPlayer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { gameSessionId } = req.params;
    const result = yield (0, randomSession_service_1.acceptRandomPlayerService)(loginUserId, gameSessionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Random Player is accepted successfully",
        data: result,
    });
}));
exports.acceptRandomPlayer = acceptRandomPlayer;
const removeRandomPlayer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameSessionId } = req.params;
    const result = yield (0, randomSession_service_1.removeRandomPlayerService)(gameSessionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Random Player is removed successfully",
        data: result,
    });
}));
exports.removeRandomPlayer = removeRandomPlayer;
