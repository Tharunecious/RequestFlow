const jwt = require("jsonwebtoken");


// ---------------- AUTHENTICATE USER ----------------
const authenticateJWT = (
    req,
    res,
    next
) => {
    try {
        const authHeader =
            req.headers.authorization;

        // Check token exists
        if (
            !authHeader ||
            !authHeader.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authorization token required",
            });
        }

        // Extract token
        const token =
            authHeader.split(" ")[1];

        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Save user data in request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token",
        });
    }
};


// ---------------- AUTHORIZE ROLE ----------------
const authorizeRoles = (
    ...roles
) => {
    return (
        req,
        res,
        next
    ) => {
        // Check logged in user
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message:
                    "Unauthorized access",
            });
        }

        // Check role permission
        if (
            !roles.includes(
                req.user.role
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });
        }

        next();
    };
};

module.exports = {
    authenticateJWT,
    authorizeRoles,
};