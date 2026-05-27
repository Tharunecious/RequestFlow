const mongoose = require("mongoose");
const { Request } = require("../models/Request");

// =========================================
// Create Request
// =========================================
const createRequest = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
        } = req.body;

        // Validation
        if (
            !title ||
            !description ||
            !category ||
            !priority
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required",
            });
        }

        const validCategories = [
            "IT",
            "HR",
            "Facilities",
            "Administration",
            "Security",
            "Learning & Development",
            "Finance",
        ];

        const validPriorities = [
            "Low",
            "Medium",
            "High",
        ];

        if (
            !validCategories.includes(category)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
            });
        }

        if (
            !validPriorities.includes(priority)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority",
            });
        }

        const newRequest =
            await Request.create({
                title,
                description,
                category,
                priority,
                status: "Submitted",
                submittedBy: req.user.id,

                logs: [
                    {
                        status: "Submitted",
                        updatedBy: req.user.id,
                        timestamp: new Date(),
                        message:
                            "Request created and submitted.",
                    },
                ],
            });

        return res.status(201).json({
            success: true,
            message:
                "Request created successfully",
            data: newRequest,
        });
    } catch (error) {
        console.error(
            "Create request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during request creation",
        });
    }
};

// =========================================
// Get Requests
// =========================================
const getRequests = async (
    req,
    res
) => {
    try {
        const {
            status,
            category,
            priority,
            startDate,
            endDate,
        } = req.query;

        const query = {};

        // User sees only own requests
        if (
            req.user.role === "User"
        ) {
            query.submittedBy =
                req.user.id;
        }

        // Filters
        if (status) {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (priority) {
            query.priority = priority;
        }

        // Date filter
        if (
            startDate ||
            endDate
        ) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte =
                    new Date(startDate);
            }

            if (endDate) {
                const end =
                    new Date(endDate);

                end.setHours(
                    23,
                    59,
                    59,
                    999
                );

                query.createdAt.$lte =
                    end;
            }
        }

        const requests =
            await Request.find(query)
                .populate(
                    "submittedBy",
                    "name email role userId"
                )
                .populate(
                    "logs.updatedBy",
                    "name email role userId"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            message:
                "Requests fetched successfully",
            data: requests,
        });
    } catch (error) {
        console.error(
            "Get requests error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching requests",
        });
    }
};

// =========================================
// Get Single Request
// =========================================
const getRequestById = async (
    req,
    res
) => {
    try {
        const { id } =
            req.params;

        const request =
            await Request.findById(id)
                .populate(
                    "submittedBy",
                    "name email role userId"
                )
                .populate(
                    "logs.updatedBy",
                    "name email role userId"
                );

        if (!request) {
            return res.status(404).json({
                success: false,
                message:
                    "Request not found",
            });
        }

        // User can only view own request
        if (
            req.user.role ===
            "User" &&
            request.submittedBy._id.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Request fetched successfully",
            data: request,
        });
    } catch (error) {
        console.error(
            "Get request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error fetching request",
        });
    }
};

// =========================================
// Update Request Status
// =========================================
const updateRequestStatus =
    async (req, res) => {
        try {
            const { id } =
                req.params;

            const {
                status,
                message,
                title,
                description,
                category,
                priority,
            } = req.body;

            const request =
                await Request.findById(id);

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Request not found",
                });
            }

            const currentStatus =
                request.status;

            // ==========================
            // USER RESUBMIT
            // ==========================
            if (
                status === "Submitted"
            ) {
                if (
                    ![
                        "User",
                        "Admin",
                    ].includes(
                        req.user.role
                    )
                ) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "Only users can resubmit",
                    });
                }

                if (
                    request.submittedBy.toString() !==
                    req.user.id
                ) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "You can edit only your request",
                    });
                }

                if (
                    currentStatus !==
                    "Needs Clarification"
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Only clarification requests can be resubmitted",
                    });
                }

                if (title)
                    request.title =
                        title;

                if (description)
                    request.description =
                        description;

                if (category)
                    request.category =
                        category;

                if (priority)
                    request.priority =
                        priority;

                request.status =
                    "Submitted";

                request.logs.push({
                    status:
                        "Submitted",
                    updatedBy:
                        new mongoose.Types.ObjectId(
                            req.user.id
                        ),
                    timestamp:
                        new Date(),
                    message:
                        message ||
                        "Request edited and resubmitted.",
                });

                await request.save();

                return res.status(200).json({
                    success: true,
                    message:
                        "Request updated successfully",
                    data: request,
                });
            }

            // ==========================
            // MANAGER ACTIONS
            // ==========================
            if (
                [
                    "Approved",
                    "Rejected",
                    "Needs Clarification",
                ].includes(status)
            ) {
                if (
                    ![
                        "Manager",
                        "Admin",
                    ].includes(
                        req.user.role
                    )
                ) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "Only Manager/Admin allowed",
                    });
                }

                if (
                    ![
                        "Submitted",
                        "Reopened",
                    ].includes(
                        currentStatus
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid status transition",
                    });
                }

                request.status =
                    status;

                request.logs.push({
                    status,
                    updatedBy:
                        new mongoose.Types.ObjectId(
                            req.user.id
                        ),
                    timestamp:
                        new Date(),
                    message:
                        message ||
                        `Status changed to ${status}`,
                });

                await request.save();

                return res.status(200).json({
                    success: true,
                    message:
                        "Request updated successfully",
                    data: request,
                });
            }

            // ==========================
            // ADMIN ACTIONS
            // ==========================
            if (
                [
                    "Closed",
                    "Reopened",
                ].includes(status)
            ) {
                if (
                    req.user.role !==
                    "Admin"
                ) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "Only admin allowed",
                    });
                }

                if (
                    status ===
                    "Closed" &&
                    currentStatus !==
                    "Approved"
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Only approved requests can be closed",
                    });
                }

                if (
                    status ===
                    "Reopened" &&
                    currentStatus !==
                    "Closed"
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Only closed requests can be reopened",
                    });
                }

                request.status =
                    status;

                request.logs.push({
                    status,
                    updatedBy:
                        new mongoose.Types.ObjectId(
                            req.user.id
                        ),
                    timestamp:
                        new Date(),
                    message:
                        message ||
                        `Status changed to ${status}`,
                });

                await request.save();

                return res.status(200).json({
                    success: true,
                    message:
                        "Request updated successfully",
                    data: request,
                });
            }

            return res.status(400).json({
                success: false,
                message:
                    "Invalid target status",
            });
        } catch (error) {
            console.error(
                "Update request error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Server error updating request",
            });
        }
    };

module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequestStatus,
};