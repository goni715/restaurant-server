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
exports.deleteSocialMediaService = exports.updateSocialMediaService = exports.getSocialMediaService = exports.createSocialMediaService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const socialMedia_model_1 = __importDefault(require("./socialMedia.model"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const createSocialMediaService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check restaurant exist
    const restaurant = yield restaurant_model_1.default.findOne({ ownerId: loginUserId });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    //check already social-media exist
    const socialMedia = yield socialMedia_model_1.default.findOne({ ownerId: loginUserId, restaurantId: restaurant._id });
    if (socialMedia) {
        throw new AppError_1.default(409, "Social Media is already exist");
    }
    const result = yield socialMedia_model_1.default.create(Object.assign(Object.assign({}, payload), { ownerId: loginUserId, restaurantId: restaurant._id }));
    return result;
});
exports.createSocialMediaService = createSocialMediaService;
const getSocialMediaService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    //check social-media not found
    const socialMedia = yield socialMedia_model_1.default.findOne({
        ownerId: loginUserId
    });
    if (!socialMedia) {
        throw new AppError_1.default(404, "Social Media not found");
    }
    return socialMedia;
});
exports.getSocialMediaService = getSocialMediaService;
const updateSocialMediaService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check restaurant exist
    const restaurant = yield restaurant_model_1.default.findOne({ ownerId: loginUserId });
    if (!restaurant) {
        throw new AppError_1.default(404, "Restaurant not found");
    }
    //check social-media not found
    const socialMedia = yield socialMedia_model_1.default.findOne({ ownerId: loginUserId, restaurantId: restaurant._id });
    if (!socialMedia) {
        throw new AppError_1.default(404, "Social Media not found");
    }
    const result = yield socialMedia_model_1.default.updateOne({ ownerId: loginUserId, restaurantId: restaurant._id }, payload);
    return result;
});
exports.updateSocialMediaService = updateSocialMediaService;
const deleteSocialMediaService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    //check social-media not found
    const socialMedia = yield socialMedia_model_1.default.findOne({
        ownerId: loginUserId
    });
    if (!socialMedia) {
        throw new AppError_1.default(404, "Social Media not found");
    }
    const result = yield socialMedia_model_1.default.deleteOne({ ownerId: loginUserId });
    return result;
});
exports.deleteSocialMediaService = deleteSocialMediaService;
