import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
export const generateHash = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password + salt, saltOrRounds);
  return { pass: hash, salt };
};

export const checkPassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
