import React, { useState, useMemo } from "react";
import { DashboardHeader } from "../../Component/DashboardHeader";
import { StatusMetrics } from "../../Component/StatusMetrics";
import { DataTable } from "../../Component/DataTable";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";

import {
    Eye,
    MessageSquare,
    Search,
} from "lucide-react";

export const ManagerDashboard = ({
    requests,
    filterStatus,
    onFilterStatusSelect,
    onViewDetails,
    onReview,
    onSendMessage,
}) => {
    // Pending review count for the info bar

    const dispatch = useDispatch();

    const logout = () => {
        dispatch({ type: "auth/logout" });
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    }
    const getPendingCount = () => {
        return requests.filter((r) =>
            ["Submitted", "Reopened"].includes(r.status)
        ).length;
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRequests = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return requests;

        return requests.filter((req) => {
            const submittedByName = req.submittedBy?.name || "";
            const submittedById = req.submittedBy?.userId || "";

            return [
                req.title,
                req.description,
                req.category,
                req.priority,
                req.status,
                submittedByName,
                submittedById,
                req._id,
            ]
                .filter(Boolean)
                .some((value) =>
                    value
                        .toString()
                        .toLowerCase()
                        .includes(query)
                );
        });
    }, [requests, searchQuery]);

    // Status badge helper
    const getStatusBadgeClass = (status) => {
        const base = "StatusBadge w-fit inline-flex whitespace-nowrap";
        switch (status) {
            case "Submitted":
                return `${base} StatusSubmitted`;
            case "Approved":
                return `${base} StatusApproved`;
            case "Rejected":
                return `${base} StatusRejected`;
            case "Needs Clarification":
                return `${base} StatusNeedsClarification`;
            case "Closed":
                return `${base} StatusClosed`;
            case "Reopened":
                return `${base} StatusReopened`;
            default:
                return base;
        }
    };

    // Priority badge helper
    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case "High":
                return "PriorityHigh";
            case "Medium":
                return "PriorityMedium";
            default:
                return "PriorityLow";
        }
    };

    // Date formatter
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Shared grid layout for DataTable - ensures perfect header-body alignment
    // 5 columns: Req ID, Title, Category, Status, Actions
    const gridTemplateColumns = 'auto minmax auto auto auto auto';
    // Table column definitions
    const columns = [
        {
            key: "reqId",
            header: "Req ID",
            // headerClassName: "w-auto",
            cellClassName: "font-mono font-semibold text-xs text-indigo-400",
            render: (req) =>
                `ID${req._id.substring(req._id.length - 6).toUpperCase()}`,
        },
        {
            key: "title",
            header: "Title",
            render: (req) => (
                <>
                    <div className="font-medium text-white line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {req.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap mt-0.5">
                        {req.description}
                    </div>
                </>
            ),
        },
        {
            key: "category",
            header: "Category",
            cellClassName: "font-medium text-slate-400",
        },
        // removed Priority column
        {
            key: "status",
            header: "Status",
            render: (req) => (
                <span className={getStatusBadgeClass(req.status)}>
                    {req.status}
                </span>
            ),
        },
        {
            key: "submittedDate",
            header: "Submitted Date",
            cellClassName: "text-slate-400 text-xs whitespace-nowrap",
            render: (req) =>
                req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    : "-"
        },
        // removed Submitted By and Date columns
        {
            key: "actions",
            header: "Actions",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (req) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onViewDetails(req)}
                        className="FormButtonSecondary py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="sm:inline hidden">Details</span>
                    </button>

                    {onReview &&
                        ["Submitted", "Reopened"].includes(req.status) && (
                            <button
                                onClick={() => onReview(req)}
                                className="FormButtonPrimary py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                            >
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="sm:inline hidden">Review</span>
                            </button>
                        )}

                    {req.status === "Needs Clarification" && onSendMessage && (
                        <button
                            onClick={() => onSendMessage(req)}
                            className="FormButtonSecondary py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span className="sm:inline hidden">Send Message</span>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 h-full overflow-hidden p-2 sm:p-4">
            <DashboardHeader
                title="Manager Approval Dashboard"
                subtitle="Review and approve employee requests."
                actions={
                    <>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-[0.7rem] sm:text-base bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden min-[450px]:inline">Logout</span>
                        </button>

                    </>

                }
            />

            <StatusMetrics
                requests={requests}
                filterStatus={filterStatus}
                onFilterStatusSelect={onFilterStatusSelect}
                infoBarRight={
                    <span className="text-rose-400 font-semibold flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                        <span>Pending Manager Review: {getPendingCount()}</span>
                    </span>
                }
            />

            <div className="flex flex-col gap-3 flex-1 min-h-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h3 className="text-white text md sm:text-lg font-semibold">Manager Requests</h3>

                    <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..."
                            className="w-full sm:w-72 bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredRequests}
                    maxHeight="100%"
                    gridTemplateColumns={gridTemplateColumns}
                />
            </div>
        </div>
    );
};

export default ManagerDashboard;