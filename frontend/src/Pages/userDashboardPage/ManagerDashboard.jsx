import React from "react";
import { DashboardHeader } from "../../Component/DashboardHeader";
import { StatusMetrics } from "../../Component/StatusMetrics";
import { DataTable } from "../../Component/DataTable";
import { useDispatch } from "react-redux";
import {LogOut} from "lucide-react";

import {
    Eye,
    MessageSquare,
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

    // Status badge helper
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Submitted":
                return "StatusBadge StatusSubmitted";
            case "Approved":
                return "StatusBadge StatusApproved";
            case "Rejected":
                return "StatusBadge StatusRejected";
            case "Needs Clarification":
                return "StatusBadge StatusNeedsClarification";
            case "Closed":
                return "StatusBadge StatusClosed";
            case "Reopened":
                return "StatusBadge StatusReopened";
            default:
                return "StatusBadge";
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
    const gridTemplateColumns = '120px minmax(300px, 2fr) 140px 140px minmax(200px, 1fr)';

    // Table column definitions
    const columns = [
        {
            key: "reqId",
            header: "Req ID",
            headerClassName: "w-auto",
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
                        Details
                    </button>

                    {onReview &&
                        ["Submitted", "Reopened"].includes(req.status) && (
                            <button
                                onClick={() => onReview(req)}
                                className="FormButtonPrimary py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                            >
                                <MessageSquare className="h-3.5 w-3.5" />
                                Review
                            </button>
                        )}

                    {req.status === "Needs Clarification" && onSendMessage && (
                        <button
                            onClick={() => onSendMessage(req)}
                            className="FormButtonSecondary py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                        >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Send Message
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto p-6">
            <DashboardHeader
                title="Manager Approval Dashboard"
                subtitle="Review and approve employee requests."
                actions={
                    <>
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-[0.7rem] sm:text-base bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                            Logout
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

            <DataTable
                columns={columns}
                data={requests}
                gridTemplateColumns={gridTemplateColumns}
            />
        </div>
    );
};

export default ManagerDashboard;