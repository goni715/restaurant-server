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
const user_model_1 = __importDefault(require("../modules/User/user.model"));
const calculateXP = (userId, opponentId, isCorrect, responseTime, fastestResponseTime) => __awaiter(void 0, void 0, void 0, function* () {
    const baseXP = isCorrect ? 20 : 0;
    let bonusXP = 0;
    let handicapXP = 0;
    // Fetch skill levels of both players
    const user = yield user_model_1.default.findById(userId);
    const opponent = yield user_model_1.default.findById(opponentId);
    if (!user || !opponent)
        return baseXP; // Default if no user found
    // Bonus XP for fast response
    if (responseTime === fastestResponseTime) {
        bonusXP = 5; // Fastest player gets an extra 5 points
    }
    // Handicap XP based on skill level difference
    const skillDifference = opponent.xp - user.xp;
    if (skillDifference > 100) {
        handicapXP = 10; // If opponent is much stronger, give extra XP
    }
    else if (skillDifference < -100) {
        handicapXP = -5; // If opponent is much weaker, reduce XP
    }
    return baseXP + bonusXP + handicapXP;
});
exports.default = ;
