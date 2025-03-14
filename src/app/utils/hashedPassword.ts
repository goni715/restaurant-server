import bcrypt from 'bcryptjs';
import config from '../config';

const hashedPassword = async (password:string) => {
  const salt = await bcrypt.genSalt(Number(config.bcrypt_salt_rounds));
  return await bcrypt.hash(password, salt) //hashedPassword
}

export default hashedPassword;