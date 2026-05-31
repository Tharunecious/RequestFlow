import React from 'react';
import { useSelector } from 'react-redux';
import {
    Eye,
    Edit3,
    CheckCircle,
    RotateCcw,
    AlertTriangle,
    MessageSquare,
} from 'lucide-react';

export const RequestTable = ({
    requests,
    onViewDetails,
    onReview,
    onResubmit,
    onCloseRequest,
    onReopenRequest,
}) => {
    const user = useSelector((state) => state.auth.user);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Submitted':
                return 'StatusBadge StatusSubmitted';
            case 'Approved':
                return 'StatusBadge StatusApproved';
            case 'Rejected':
                return 'StatusBadge StatusRejected';
            case 'Needs Clarification':
                return 'StatusBadge StatusNeedsClarification';
            case 'Closed':
                return 'StatusBadge StatusClosed';
            case 'Reopened':
                return 'StatusBadge StatusReopened';
            default:
                return 'StatusBadge';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'High':
                return 'PriorityHigh';
            case 'Medium':
                return 'PriorityMedium';
            default:
                return 'PriorityLow';
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Shared grid layout for header and body alignment
    // Uses inline style to ensure perfect alignment across all rows
    const gridTemplateColumns = '120px minmax(300px, 2fr) 140px 120px 140px 150px 120px minmax(200px, 1fr)';

    return (
        <section className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">
            <div className="flex flex-col h-full min-h-0">

                {/* Header Section - No Scroll */}
                <div className="flex-shrink-0 bg-slate-900 border-b border-slate-800">
                    <div className="grid w-full gap-0" style={{ gridTemplateColumns }}>
                        <div className="TableHeaderCell">
                            Req ID
                        </div>

                        <div className="TableHeaderCell">
                            Title
                        </div>

                        <div className="TableHeaderCell">
                            Category
                        </div>

                        <div className="TableHeaderCell">
                            Priority
                        </div>

                        <div className="TableHeaderCell">
                            Status
                        </div>

                        <div className="TableHeaderCell">
                            Submitted By
                        </div>

                        <div className="TableHeaderCell">
                            Date
                        </div>

                        <div className="TableHeaderCell text-right">
                            Actions
                        </div>
                    </div>
                </div>

                {/* Body Section - Scrollable Only */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {requests?.length > 0 ? (
                        <div className="flex flex-col">
                            {requests.map((req) => (
                                <div
                                    key={req._id}
                                    className="grid w-full gap-0 border-b border-slate-800 hover:bg-slate-900/40 transition-colors"
                                    style={{ gridTemplateColumns }}
                                >
                                    {/* Req ID */}
                                    <div className="TableCell font-mono font-semibold text-xs text-indigo-400">
                                        ID
                                        {req._id
                                            .slice(-6)
                                            .toUpperCase()}
                                    </div>

                                    {/* Title */}
                                    <div className="TableCell">
                                        <div className="font-medium text-white truncate overflow-hidden text-ellipsis whitespace-nowrap">
                                            {req.title}
                                        </div>

                                        <div className="text-xs text-slate-500 truncate overflow-hidden text-ellipsis whitespace-nowrap mt-1">
                                            {req.description}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="TableCell text-slate-400 font-medium">
                                        {req.category}
                                    </div>

                                    {/* Priority */}
                                    <div className="TableCell">
                                        <span
                                            className={getPriorityBadgeClass(
                                                req.priority
                                            )}
                                        >
                                            {req.priority}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="TableCell">
                                        <span
                                            className={getStatusBadgeClass(
                                                req.status
                                            )}
                                        >
                                            {req.status}
                                        </span>
                                    </div>

                                    {/* Submitted By */}
                                    <div className="TableCell">
                                        <div className="font-semibold text-slate-300 text-xs">
                                            {req.submittedBy?.name}
                                        </div>

                                        <div className="text-[10px] text-slate-500">
                                            {req.submittedBy?.userId}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="TableCell text-xs text-slate-500">
                                        {formatDate(
                                            req.createdAt
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="TableCell">
                                        <div className="flex flex-wrap items-center justify-end gap-2">

                                            <button
                                                onClick={() =>
                                                    onViewDetails(req)
                                                }
                                                className="FormButtonSecondary py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs whitespace-nowrap"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Details
                                            </button>

                                            {user?.role ===
                                                'Manager' &&
                                                onReview &&
                                                [
                                                    'Submitted',
                                                    'Reopened',
                                                ].includes(
                                                    req.status
                                                ) && (
                                                    <button
                                                        onClick={() =>
                                                            onReview(req)
                                                        }
                                                        className="FormButtonPrimary py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs whitespace-nowrap"
                                                    >
                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                        Review
                                                    </button>
                                                )}

                                            {user?.role ===
                                                'User' &&
                                                onResubmit &&
                                                req.status ===
                                                'Needs Clarification' && (
                                                    <button
                                                        onClick={() =>
                                                            onResubmit(req)
                                                        }
                                                        className="FormButtonWarning py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs whitespace-nowrap"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                        Resubmit
                                                    </button>
                                                )}

                                            {user?.role ===
                                                'Admin' &&
                                                onCloseRequest &&
                                                req.status ===
                                                'Approved' && (
                                                    <button
                                                        onClick={() =>
                                                            onCloseRequest(req)
                                                        }
                                                        className="FormButtonDanger py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs whitespace-nowrap"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Close
                                                    </button>
                                                )}

                                            {user?.role ===
                                                'Admin' &&
                                                onReopenRequest &&
                                                req.status ===
                                                'Closed' && (
                                                    <button
                                                        onClick={() =>
                                                            onReopenRequest(req)
                                                        }
                                                        className="FormButtonPrimary py-1.5 px-3 rounded-lg flex items-center gap-1 text-xs whitespace-nowrap"
                                                    >
                                                        <RotateCcw className="h-3.5 w-3.5" />
                                                        Reopen
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                                <AlertTriangle className="h-8 w-8" />

                                <p className="font-semibold">
                                    No requests match filters
                                </p>

                                <p className="text-xs text-slate-600">
                                    Try adjusting filters
                                    or create a new request.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RequestTable;