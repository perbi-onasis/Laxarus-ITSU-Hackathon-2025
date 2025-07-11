import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

export function generateOTP(length = 6): string {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, length);
}

export function signJWT(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "1d"
): string {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJWT(token: string): string | JwtPayload {
  return jwt.verify(token, JWT_SECRET);
}
