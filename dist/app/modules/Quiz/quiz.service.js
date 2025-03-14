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
exports.getSingleQuizService = exports.getAllQuizService = exports.deleteQuizService = exports.createQuizService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const quiz_model_1 = __importDefault(require("./quiz.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = require("mongoose");
const quiz_constant_1 = require("./quiz.constant");
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const createQuizService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(payload.quiz);
    //check Quiz is already existed
    const Quiz = yield quiz_model_1.default.findOne({ slug: slug.toLowerCase() });
    if (Quiz) {
        throw new AppError_1.default(409, 'Quiz is already existed');
    }
    const result = yield quiz_model_1.default.create(Object.assign(Object.assign({}, payload), { slug: slug.toLowerCase() }));
    return result;
});
exports.createQuizService = createQuizService;
const deleteQuizService = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    //check quizId doesn't exist
    const Quiz = yield quiz_model_1.default.findById(quizId);
    if (!Quiz) {
        throw new AppError_1.default(404, `This quizId doesn't exist`);
    }
    const result = yield quiz_model_1.default.deleteOne({ _id: new ObjectId(quizId) });
    return result;
});
exports.deleteQuizService = deleteQuizService;
const getAllQuizService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Extract query parameters
    const { searchTerm, // Text to search
    page = 1, // Default to page 1
    limit = 10, // Default to 10 results per page // Default sort field
    sortOrder = 'desc', sortBy: SortField } = query, // Default sort order
    filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    // 3. Set up sorting
    let sortBy = 'createdAt';
    if (SortField) {
        sortBy = SortField;
    }
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    let finalQuery = {};
    //  const searchRegex = QuizSearchFields.map((item)=>({
    //     [item] : { $regex: searchTerm, $options: 'i' }
    //  }))
    // 4. Set up search
    //  if (searchTerm) {
    //     finalQuery = {
    //         ...finalQuery,
    //         $or: [
    //             { name: { $regex: searchTerm, $options: 'i' } },    // Case-insensitive name search
    //             { email: { $regex: searchTerm, $options: 'i' } }   // Case-insensitive email search
    //         ]
    //     };
    // }
    if (searchTerm) {
        const searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, quiz_constant_1.QuizSearchFields);
        finalQuery = Object.assign(Object.assign({}, finalQuery), searchQuery);
    }
    // 6. Execute query with pagination and sorting
    const result = yield quiz_model_1.default.find(finalQuery)
        .skip(skip)
        .limit(Number(limit))
        .sort({ [sortBy]: sortDirection });
    // 7. Get total count for pagination
    const total = yield quiz_model_1.default.countDocuments(finalQuery);
    const totalPages = Math.ceil(total / Number(limit));
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total,
        },
        data: result
    };
});
exports.getAllQuizService = getAllQuizService;
const getSingleQuizService = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    const Quiz = yield quiz_model_1.default.findById(quizId);
    if (!Quiz) {
        throw new AppError_1.default(404, `This quizId doesn't exist`);
    }
    return Quiz;
});
exports.getSingleQuizService = getSingleQuizService;
