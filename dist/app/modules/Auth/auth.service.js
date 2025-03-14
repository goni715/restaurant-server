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
exports.changePasswordService = exports.forgotPassCreateNewPassService = exports.forgotPassVerifyOtpService = exports.forgotPassSendOtpService = exports.loginAdminService = exports.loginUserService = exports.registerUserService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const checkPassword_1 = __importDefault(require("../../utils/checkPassword"));
const user_model_1 = __importDefault(require("../User/user.model"));
const createToken_1 = __importDefault(require("../../utils/createToken"));
const config_1 = __importDefault(require("../../config"));
const otp_model_1 = __importDefault(require("./otp.model"));
const sendEmailUtility_1 = __importDefault(require("../../utils/sendEmailUtility"));
const hashedPassword_1 = __importDefault(require("../../utils/hashedPassword"));
const mongoose_1 = require("mongoose");
const registerUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (user) {
        throw new AppError_1.default(400, 'Email is already existed');
    }
    const result = yield user_model_1.default.create(payload);
    result.password = '';
    return result;
});
exports.registerUserService = registerUserService;
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
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
exports.loginUserService = loginUserService;
const loginAdminService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(404, `Couldn't find this email address`);
    }
    //check you are not admin
    if (user.role !== "admin") {
        throw new AppError_1.default(400, `Sorry! You are not admin`);
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
exports.loginAdminService = loginAdminService;
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
        throw new AppError_1.default(404, `This Otp Code is expired`);
    }
    //update the password
    const hashPass = yield (0, hashedPassword_1.default)(password); //hashedPassword
    const result = yield user_model_1.default.updateOne({ email: email }, { password: hashPass });
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
    const result = yield user_model_1.default.updateOne({ _id: new ObjectId(loginUserId) }, { password: hashPass });
    return result;
});
exports.changePasswordService = changePasswordService;
