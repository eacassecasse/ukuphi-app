import { hashSync, compareSync } from "bcrypt";

export function hashPassword(password: string) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
  return hashSync(password, saltRounds);
}

export function verifyPassword({
  candidatePassword,
  hash,
}: {
  candidatePassword: string;
  hash: string;
}) {
  return compareSync(candidatePassword, hash);
}
