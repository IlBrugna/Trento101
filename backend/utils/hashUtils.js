import dotenv from 'dotenv';
import bcrypt from 'bcrypt';


//genera hash
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, parseInt(process.env.SALT_ROUNDS,10));
};

//verifica password 
export const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};