import bcrypt from 'bcrypt'

export const hashPassword = async (plainPassword, rounds = 12) => {
  if (!plainPassword) throw new Error('Password is required');
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(plainPassword, salt);
}

export const validatePassword = async (hashedPassword, plainPassword) => {
  if (!hashedPassword || !plainPassword) throw new Error('Both hashedPassword and plainPassword are required');
  return bcrypt.compare(plainPassword, hashedPassword);
}