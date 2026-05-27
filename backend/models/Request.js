"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = require("mongoose");
const RequestLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['Submitted', 'Approved', 'Rejected', 'Needs Clarification', 'Closed', 'Reopened'],
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
    message: {
        type: String,
        trim: true,
    },
}, { _id: false });
const RequestSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ['IT', 'HR', 'Facilities', 'Administration', 'Security', 'Learning & Development', 'Finance'],
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Submitted', 'Approved', 'Rejected', 'Needs Clarification', 'Closed', 'Reopened'],
        default: 'Submitted',
        required: true,
    },
    submittedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    logs: [RequestLogSchema],
}, {
    timestamps: true,
});
exports.Request = (0, mongoose_1.model)('Request', RequestSchema);
