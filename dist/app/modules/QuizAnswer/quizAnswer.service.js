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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateXPService = exports.getMyQuizHistoryService = exports.getQuizResultsService = exports.submitQuizAnswerService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const gameSession_model_1 = __importDefault(require("../GameSession/gameSession.model"));
const quiz_model_1 = __importDefault(require("../Quiz/quiz.model"));
const quizAnswer_model_1 = __importDefault(require("./quizAnswer.model"));
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const quizAnswer_constant_1 = require("./quizAnswer.constant");
const submitQuizAnswerService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, selectedOption, responseTime } = payload;
    const quiz = yield quiz_model_1.default.findById(quizId);
    if (!quiz) {
        throw new AppError_1.default(404, "This quizId not found");
    }
    //check gameSession doesn't exist
    const gameSession = yield gameSession_model_1.default.findOne({
        players: { $in: [loginUserId] },
    });
    if (!gameSession) {
        throw new AppError_1.default(404, "Game session Doesn't exist ");
    }
    if (!quiz.options.includes(selectedOption)) {
        throw new AppError_1.default(404, "selected option does not exist within the options");
    }
    const isCorrect = quiz.answer === selectedOption;
    //check you have already submitted the answer
    const quizAnswer = yield quizAnswer_model_1.default.findOne({
        gameSessionId: gameSession._id,
        userId: loginUserId,
        quizId: quiz._id,
    });
    if (quizAnswer) {
        throw new AppError_1.default(409, "You have alraedy submitted the answer");
    }
    //Save user's answer
    const result = yield quizAnswer_model_1.default.create({
        gameSessionId: gameSession._id,
        userId: loginUserId,
        quizId: quiz._id,
        selectedOption,
        isCorrect,
        responseTime
    });
    return result;
});
exports.submitQuizAnswerService = submitQuizAnswerService;
// 🟢 Get Quiz Results (Weekly or Monthly)
const getQuizResultsService = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    let startDate;
    let endDate;
    if (type === "monthly") {
        endDate = new Date(now.toISOString().split("T")[0] + "T23:59:59.999+00:00");
        now.setDate(now.getDate() - 29);
        startDate = new Date(now.toISOString().split("T")[0]); // 29 days ago = 30 days
        // Last day of the month
    }
    else {
        endDate = new Date(now.toISOString().split("T")[0] + "T23:59:59.999+00:00");
        now.setDate(now.getDate() - 6);
        startDate = new Date(now.toISOString().split("T")[0]); // 6 days ago = 7 days
    }
    const result = yield quizAnswer_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: "$userId",
                totalXP: { $sum: "$xp" },
                totalCorrect: { $sum: { $cond: ["$isCorrect", 1, 0] } }, // Count correct answers
                totalAttempted: { $sum: 1 }, // Count total attempted quizzes
            },
        },
    ]);
    return result;
});
exports.getQuizResultsService = getQuizResultsService;
const getMyQuizHistoryService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { searchTerm, // Text to search
    page = 1, // Default to page 1
    limit = 10, // Default to 10 results per page // Default sort field
    sortOrder = "desc", sortBy = "createdAt" } = query, // Default sort order
    filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, quizAnswer_constant_1.HistorySearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield quizAnswer_model_1.default.aggregate([
        {
            $match: { userId: new ObjectId(loginUserId) }
        },
        {
            $lookup: {
                from: "quizzes",
                localField: "quizId",
                foreignField: "_id",
                as: "quizDetails"
            }
        },
        {
            $unwind: "$quizDetails"
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery), // Apply search & filter queries
        },
        {
            $project: {
                _id: "$quizId",
                quiz: "$quizDetails.quiz",
                options: "$quizDetails.options",
                answer: "$quizDetails.answer",
                explanation: "$quizDetails.explanation",
                createdAt: "$quizDetails.createdAt",
                isCorrect: 1
            }
        }
        //you want to show these field without renaming the field name
        // {
        //   $project: {
        //     _id: 1,
        //     quizId: 1,
        //     selectedOption: 1,
        //     isCorrect: 1,
        //     responseTime: 1,
        //     createdAt: 1,
        //     "quizDetails.quiz": 1,
        //     "quizDetails.options": 1,
        //     "quizDetails.answer": 1,
        //     "quizDetails.explanation": 1,
        //   }
        // }
    ]);
    return result;
});
exports.getMyQuizHistoryService = getMyQuizHistoryService;
const calculateXPService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizResults, playersXP } = payload;
    //   const quizResults = {
    //     quiz1Result: [
    //         {
    //             userId: "67ceb7f91f0adb45a67c9700",
    //             quizId: "67cecba4cd8885d418f403ad",
    //             isCorrect: true,
    //             responseTime: 15,
    //             timeLimit: 20,
    //             point: 20,
    //         },
    //         {
    //             userId: "67ceb7a50e498c657f204089",
    //             quizId: "67cecba4cd8885d418f403ad",
    //             isCorrect: false,
    //             responseTime: 15,
    //             timeLimit: 20,
    //             point: 20,
    //         },
    //     ],
    //     quiz2Result: [
    //         {
    //             userId: "67ceb7a50e498c657f204089",
    //             quizId: "67cebd5350c18f87958365aa",
    //             isCorrect: true,
    //             responseTime: 15,
    //             timeLimit: 20,
    //             point: 20,
    //         },
    //         {
    //             userId: "67ceb7f91f0adb45a67c9700",
    //             quizId: "67cebd5350c18f87958365aa",
    //             isCorrect: false,
    //             responseTime: 15,
    //             timeLimit: 20,
    //             point: 20,
    //         },
    //     ],
    // };
    // const playersXP = [
    // {
    //   userId: "67ceb7a50e498c657f204089",
    //   XP: 500
    // },
    // {
    //   userId: "67ceb7f91f0adb45a67c9700",
    //   XP: 300
    // }
    // ]
    function calculateXP(quizResults, playersXP) {
        // Flatten all quiz results into a single array
        const allResults = Object.values(quizResults).flat();
        // Create a map for quick lookup of player XP
        const playerMap = new Map(playersXP.map((player) => [player.userId, player.XP]));
        // Group players by quiz session
        const groupedByQuiz = {};
        allResults.forEach((result) => {
            if (!groupedByQuiz[result.quizId]) {
                groupedByQuiz[result.quizId] = [];
            }
            groupedByQuiz[result.quizId].push(result);
        });
        // Process each quiz session
        Object.values(groupedByQuiz).forEach((players) => {
            var _a, _b, _c, _d;
            if (players.length !== 2)
                return; // Ensure we only process two-player matches
            const [player1, player2] = players;
            const player1XP = (_a = playerMap.get(player1.userId)) !== null && _a !== void 0 ? _a : 0;
            const player2XP = (_b = playerMap.get(player2.userId)) !== null && _b !== void 0 ? _b : 0;
            const minXP = Math.min(player1XP, player2XP);
            const maxXP = Math.max(player1XP, player2XP);
            let xpAdjustmentFactor = 1;
            if (maxXP > 0) {
                xpAdjustmentFactor = 1 + (maxXP - minXP) / maxXP; // More XP for fresher player
            }
            let basePoints = 20;
            // Assign XP based on correctness
            if (player1.isCorrect) {
                playerMap.set(player1.userId, player1XP + basePoints * (player1XP < player2XP ? xpAdjustmentFactor : 1));
            }
            if (player2.isCorrect) {
                playerMap.set(player2.userId, player2XP + basePoints * (player2XP < player1XP ? xpAdjustmentFactor : 1));
            }
            // Speed bonus: Faster player gets +5 XP
            if (player1.responseTime < player2.responseTime) {
                playerMap.set(player1.userId, ((_c = playerMap.get(player1.userId)) !== null && _c !== void 0 ? _c : 0) + 5);
            }
            else if (player2.responseTime < player1.responseTime) {
                playerMap.set(player2.userId, ((_d = playerMap.get(player2.userId)) !== null && _d !== void 0 ? _d : 0) + 5);
            }
        });
        // Convert updated XP map back to array format
        return Array.from(playerMap, ([userId, XP]) => ({ userId, XP }));
    }
    // Example usage:
    const updatedPlayersXP = calculateXP(quizResults, playersXP);
    const arr = Object.values(quizResults).flat();
    const data = arr.map((_a) => {
        var { timeLimit, point, isCorrect } = _a, rest = __rest(_a, ["timeLimit", "point", "isCorrect"]);
        return (Object.assign(Object.assign({}, rest), { isCorrect, review: !isCorrect }));
    });
    //insertMany data
    const result = yield quizAnswer_model_1.default.insertMany(data);
    return result;
});
exports.calculateXPService = calculateXPService;
