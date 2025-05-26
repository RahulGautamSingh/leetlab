import jwt, { decode } from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async(req, res, next) => {
    try {
        const token = res.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized - no token provided",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                error: "Unauthorized - Invalid token",
            });
        }

        const user = await db.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                image: true,
                name: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {}
};