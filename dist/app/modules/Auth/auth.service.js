"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.refreshTokenService = exports.deleteMyAccountService = exports.changeStatusService = exports.changePasswordService = exports.forgotPassCreateNewPassService = exports.forgotPassVerifyOtpService = exports.forgotPassSendOtpService = exports.loginSuperAdminService = exports.loginOwnerService = exports.loginUserService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const checkPassword_1 = __importDefault(require("../../utils/checkPassword"));
const user_model_1 = __importDefault(require("../User/user.model"));
const createToken_1 = __importDefault(require("../../utils/createToken"));
const config_1 = __importDefault(require("../../config"));
const sendEmailUtility_1 = __importDefault(require("../../utils/sendEmailUtility"));
const hashedPassword_1 = __importDefault(require("../../utils/hashedPassword"));
const mongoose_1 = __importStar(require("mongoose"));
const restaurant_model_1 = __importDefault(require("../Restaurant/restaurant.model"));
const socialMedia_model_1 = __importDefault(require("../SocialMedia/socialMedia.model"));
const otp_model_1 = __importDefault(require("../Otp/otp.model"));
const verifyToken_1 = __importDefault(require("../../utils/verifyToken"));
const isJWTIssuedBeforePassChanged_1 = require("../../utils/isJWTIssuedBeforePassChanged");
const menu_model_1 = __importDefault(require("../Menu/menu.model"));
const favourite_model_1 = __importDefault(require("../Favourite/favourite.model"));
const review_model_1 = __importDefault(require("../Review/review.model"));
const menuReview_model_1 = __importDefault(require("../MenuReview/menuReview.model"));
const schedule_model_1 = __importDefault(require("../Schedule/schedule.model"));
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(400, "Password is not correct");
    }
    //check you are not admin or admin
    if ((user.role !== "user") && (user.role !== "owner")) {
        throw new AppError_1.default(400, `Sorry! You have no access to login`);
    }
    //create accessToken
    const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //create refreshToken
    const refreshToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        role: user.role,
        refreshToken,
    };
});
exports.loginUserService = loginUserService;
const loginOwnerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    //check you are not admin
    if (user.role !== "owner") {
        throw new AppError_1.default(400, `Sorry! You are not Owner`);
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(400, 'Password is not correct');
    }
    //create accessToken
    const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //create refreshToken
    const refreshToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken
    };
});
exports.loginOwnerService = loginOwnerService;
const loginSuperAdminService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    //check you are not super_admin or administrator
    if ((user.role !== "administrator") && (user.role !== "super_admin")) {
        throw new AppError_1.default(400, `Sorry! You are not 'super_admin' or 'administrator'`);
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(400, 'Password is not correct');
    }
    //create accessToken
    const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //create refreshToken
    const refreshToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        message: `${user.role} is logged in successfully`
    };
});
exports.loginSuperAdminService = loginSuperAdminService;
//forgot password
// step-01
const forgotPassSendOtpService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    //insert the otp
    yield otp_model_1.default.create({ email, otp });
    //send otp to the email address
    yield (0, sendEmailUtility_1.default)(email, String(otp));
    return null;
});
exports.forgotPassSendOtpService = forgotPassSendOtpService;
//step-02
const forgotPassVerifyOtpService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    //check otp doesn't exist
    const otpExist = yield otp_model_1.default.findOne({ email, otp, status: 0 });
    if (!otpExist) {
        throw new AppError_1.default(400, "Invalid Otp Code");
    }
    //check otp is expired
    const otpExpired = yield otp_model_1.default.findOne({
        email,
        otp,
        status: 0,
        otpExpires: { $gt: new Date(Date.now()) },
    });
    if (!otpExpired) {
        throw new AppError_1.default(400, "This Otp is expired");
    }
    //update the otp status
    yield otp_model_1.default.updateOne({ email, otp, status: 0 }, { status: 1 });
    return null;
});
exports.forgotPassVerifyOtpService = forgotPassVerifyOtpService;
//step-03
const forgotPassCreateNewPassService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    //check otp exist
    const OtpExist = yield otp_model_1.default.findOne({ email, otp, status: 1 });
    if (!OtpExist) {
        throw new AppError_1.default(404, `Invalid Otp Code`);
    }
    //Database Third Process
    //check otp is expired
    const OtpExpired = yield otp_model_1.default.findOne({
        email,
        otp,
        status: 1,
        otpExpires: { $gt: new Date(Date.now()) },
    });
    if (!OtpExpired) {
        throw new AppError_1.default(400, `This Otp Code is expired`);
    }
    //update the password
    const hashPass = yield (0, hashedPassword_1.default)(password); //hashedPassword
    const result = yield user_model_1.default.updateOne({ email: email }, { password: hashPass, passwordChangedAt: new Date() });
    return result;
});
exports.forgotPassCreateNewPassService = forgotPassCreateNewPassService;
const changePasswordService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = payload;
    const ObjectId = mongoose_1.Types.ObjectId;
    const user = yield user_model_1.default.findById(loginUserId).select('+password');
    //checking if the password is not correct
    const isPasswordMatched = yield (0, checkPassword_1.default)(currentPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(400, 'Current Password is not correct');
    }
    //hash the newPassword
    const hashPass = yield (0, hashedPassword_1.default)(newPassword);
    //update the password
    const result = yield user_model_1.default.updateOne({ _id: new ObjectId(loginUserId) }, { password: hashPass, passwordChangedAt: new Date() });
    return result;
});
exports.changePasswordService = changePasswordService;
const changeStatusService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new AppError_1.default(404, "User Not Found");
    }
    const result = yield user_model_1.default.updateOne({ _id: new ObjectId(id) }, payload);
    return result;
});
exports.changeStatusService = changeStatusService;
const deleteMyAccountService = (loginUserId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const user = yield user_model_1.default.findById(loginUserId).select('+password');
    if (!user) {
        throw new AppError_1.default(404, "User Not Found");
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(400, 'Password is not correct');
    }
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete restaurant
        yield restaurant_model_1.default.deleteOne({ ownerId: new ObjectId(loginUserId) }, { session });
        //delete social media
        yield socialMedia_model_1.default.deleteOne({ ownerId: loginUserId }, { session });
        //delete menus
        yield menu_model_1.default.deleteMany({ ownerId: loginUserId }, { session });
        //delete favourite list
        yield favourite_model_1.default.deleteMany({ userId: loginUserId }, { session });
        //delete the reviews
        yield review_model_1.default.deleteMany({ userId: loginUserId }, { session });
        //delete the menu reviews
        yield menuReview_model_1.default.deleteMany({ userId: loginUserId }, { session });
        //delete the menu reviews
        yield schedule_model_1.default.deleteMany({ ownerId: loginUserId }, { session });
        //delete user
        const result = yield user_model_1.default.deleteOne({ _id: new ObjectId(loginUserId) }, { session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.deleteMyAccountService = deleteMyAccountService;
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(401, `You are not unauthorized !`);
    }
    try {
        //token-verify
        const decoded = (0, verifyToken_1.default)(token, config_1.default.jwt_refresh_secret);
        //check if the user is exist
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user) {
            throw new AppError_1.default(401, `You are unauthorized, user not found`);
        }
        //check if the user is already blocked
        const blockStatus = user.status;
        if (blockStatus === "blocked") {
            throw new AppError_1.default(401, `You are unauthorized, This user is blocked`);
        }
        //check if passwordChangedAt is greater than token iat
        if ((user === null || user === void 0 ? void 0 : user.passwordChangedAt) &&
            (0, isJWTIssuedBeforePassChanged_1.isJWTIssuedBeforePassChanged)(user === null || user === void 0 ? void 0 : user.passwordChangedAt, decoded.iat)) {
            throw new AppError_1.default(401, "You are not authorized !");
        }
        //create accessToken
        const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        return {
            accessToken,
        };
    }
    catch (err) {
        throw new AppError_1.default(401, "You are unauthorized");
    }
});
exports.refreshTokenService = refreshTokenService;
