import UserModel from "../modules/User/user.model";


const calculateXP = async (
    userId: string,
    opponentId: string,
    isCorrect: boolean,
    responseTime: number,
    fastestResponseTime: number
  ) => {
    const baseXP = isCorrect ? 20 : 0;
    let bonusXP = 0;
    let handicapXP = 0;
  
    // Fetch skill levels of both players
    const user = await UserModel.findById(userId);
    const opponent = await UserModel.findById(opponentId);
  
    if (!user || !opponent) return baseXP; // Default if no user found
  
    // Bonus XP for fast response
    if (responseTime === fastestResponseTime) {
      bonusXP = 5; // Fastest player gets an extra 5 points
    }
  
    // Handicap XP based on skill level difference
    const skillDifference = opponent.xp - user.xp;
    if (skillDifference > 100) {
      handicapXP = 10; // If opponent is much stronger, give extra XP
    } else if (skillDifference < -100) {
      handicapXP = -5; // If opponent is much weaker, reduce XP
    }
  
    return baseXP + bonusXP + handicapXP;
  };

  export default;
  