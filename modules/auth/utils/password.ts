import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const HASH_PREFIX = "scrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return `${HASH_PREFIX}:${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [prefix, salt, encodedHash] = storedHash.split(":");

  if (prefix !== HASH_PREFIX || !salt || !encodedHash) return false;

  const expectedHash = Buffer.from(encodedHash, "hex");
  if (expectedHash.length !== KEY_LENGTH) return false;

  const actualHash = (await scryptAsync(
    password,
    salt,
    KEY_LENGTH,
  )) as Buffer;

  return timingSafeEqual(actualHash, expectedHash);
}
