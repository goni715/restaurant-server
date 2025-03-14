import bcrypt from 'bcryptjs';

const checkPassword = async (plainTextPass: string, hashPassword: string) => {
    return await bcrypt.compare(plainTextPass, hashPassword);
}

export default checkPassword;
 