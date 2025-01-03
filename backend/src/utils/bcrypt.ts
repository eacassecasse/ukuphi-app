import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword({
  candidatePassword,
  hash,
}: {
  candidatePassword: string;
  hash: string;
}) {
  return bcrypt.compare(candidatePassword, hash);
}
