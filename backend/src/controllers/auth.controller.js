import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    try {
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
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                imageUrl: user.image,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error, "Error while creating user");
        res.status(500).json({
            error: "Error creating user",
        });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Incomplete details",
            });
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const hashedPassword = user.password;
        const passwordMatches = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatches) {
            return res.status(401).json({ error: "Incorrect credentials" });
        }

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
            message: "Login Successful",
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                imageUrl: user.image,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error, "Error while logging in user");
        res.status(500).json({
            error: "Error logging in user",
        });
    }
};

export const logout = async(req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        res.status(200).json({
            message: "Logout successful",
            success: true,
        });
    } catch (error) {
        console.log(error, "Error while looging out user");
        res.status(500).json({
            error: "Error loggin out user",
        });
    }
};