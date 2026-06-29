import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function generateRefreshToken(payload, expiresIn) {
  const exp = expiresIn || REFRESH_EXPIRES;
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: exp });
}

export { generateAccessToken, generateRefreshToken };
