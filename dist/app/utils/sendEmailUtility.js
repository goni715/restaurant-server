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
const config_1 = __importDefault(require("../config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmailUtility = (EmailTo, EmailText) => __awaiter(void 0, void 0, void 0, function* () {
    //transporter
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports //587,
        auth: {
            user: config_1.default.smtp_username,
            pass: config_1.default.smtp_password,
        },
    });
    const mailOptions = {
        from: `Restaurant Management ${config_1.default.smtp_from}`, //sender email address//smtp-username
        to: EmailTo, //receiver email address
        subject: "Restaurant Management Reset Password",
        html: `
             <p>Your Verification Code is: <span style="font-size: 16px; font-weight: bold;">${EmailText}</span>
              The OTP code is valid for 10 minutes.</p>`,
    };
    return yield transporter.sendMail(mailOptions);
});
exports.default = sendEmailUtility;
