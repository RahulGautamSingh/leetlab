import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
    res.send("GG");
});

app.listen(8000, () => {
    console.log("Server running on port:8000");
});