const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();


// ---------------- MIDDLEWARES ----------------
app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RequestFlow API Running",
    });
});


// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);

app.use("/api/requests", requestRoutes);


// ---------------- NOT FOUND ROUTE ----------------
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});


// ---------------- GLOBAL ERROR HANDLER ----------------
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message:
            err.message ||
            "Internal server error",
    });
});

module.exports = app;