import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Incomplete details",
        });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({
            error: "User already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            ...(name && { name }),
            role: UserRole.USER,
        },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    });

    res.status(201).json({
        message: "User Cretaed",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            imageUrl: user.image,
            role: user.role,
        },
    });
};

export const login = async(req, res) => {};

export const logout = async(req, res) => {};

export const getProfile = async(req, res) => {};