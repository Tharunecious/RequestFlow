import React, { useState, useEffect } from "react";
import { Timeline } from "./Timeline";
import {
    X,
    Tag,
    AlertOctagon,
    Calendar,
    User,
    HelpCircle,
} from "lucide-react";

export const RequestModal = ({
    isOpen,
    onClose,
    mode,
    request,
    onSubmitCreate,
    onSubmitReview,
    onSubmitResubmit,
    onSubmitAdminAction,
    initialReviewStatus,
}) => {
    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("IT");
    const [priority, setPriority] = useState("Medium");
    const [message, setMessage] = useState("");
    const [reviewStatus, setReviewStatus] = useState("Approved");

    // Load data for resubmit mode
    useEffect(() => {
        if (mode === "resubmit" && request) {
            setTitle(request.title || "");
            setDescription(request.description || "");
            setCategory(request.category || "IT");
            setPriority(request.priority || "Medium");
            setMessage("");
        } else {
            setTitle("");
            setDescription("");
            setCategory("IT");
            setPriority("Medium");
            setMessage("");
            // allow opener to preselect a review status (e.g. Needs Clarification)
            setReviewStatus(initialReviewStatus || "Approved");
        }
    }, [mode, request, isOpen, initialReviewStatus]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === "create" && onSubmitCreate) {
            onSubmitCreate({ title, description, category, priority });
        } else if (mode === "review" && onSubmitReview) {
            onSubmitReview({ status: reviewStatus, message });
        } else if (mode === "resubmit" && onSubmitResubmit) {
            onSubmitResubmit({
                title,
                description,
                category,
                priority,
                message,
            });
        } else if (
            (mode === "close-confirm" || mode === "reopen-confirm") &&
            onSubmitAdminAction
        ) {
            onSubmitAdminAction(message);
        }
    };

    const getModalTitle = () => {
        switch (mode) {
            case "create":
                return "Create New Request";
            case "review":
                return "Review Request";
            case "resubmit":
                return "Edit & Resubmit Request";
            case "close-confirm":
                return "Confirm Close Request";
            case "reopen-confirm":
                return "Confirm Reopen Request";
            default:
                return `Request Details`;
        }
    };

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

    const getPriorityClass = (pri) => {
        switch (pri) {
            case "High":
                return "PriorityHigh";
            case "Medium":
                return "PriorityMedium";
            default:
                return "PriorityLow";
        }
    };

    return (
        <div className="ModalOverlay overflow-hidden" onClick={onClose}>
            <div className="ModalContent" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <header className="flex items-center justify-between border-b border-slate-800 pb-4 px-6 md:px-8 pt-6 md:pt-8 mb-0 shrink-0">
                    <h2 className="text-lg font-bold text-white">
                        {getModalTitle()}
                    </h2>

                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto px-6 md:px-8 py-6">

                    {/* DETAILS */}
                    {mode === "details" && request && (
                        <div className="flex flex-col gap-5">

                            <div className="p-4 border rounded-xl">
                                <p className="text-white font-semibold">{request.title}</p>
                                <p className="text-sm text-slate-400">
                                    {request.description}
                                </p>

                                <div className="flex gap-3 mt-3">
                                    <span className={getStatusBadgeClass(request.status)}>
                                        {request.status}
                                    </span>

                                    <span className={getPriorityClass(request.priority)}>
                                        {request.priority}
                                    </span>
                                </div>
                            </div>

                            <Timeline logs={request.logs} />
                        </div>
                    )}

                    {/* CREATE */}
                    {mode === "create" && (
                        <div className="flex flex-col gap-4">

                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="FormInput"
                            />

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className="FormInput h-28"
                            />

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="FormSelect"
                            >
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Facilities">Facilities</option>
                                <option value="Administration">Administration</option>
                                <option value="Security">Security</option>
                                <option value="Learning & Development">Learning & Development</option>
                                <option value="Finance">Finance</option>
                            </select>

                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="FormSelect"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>

                        </div>
                    )}

                    {/* RESUBMIT */}
                    {mode === "resubmit" && request && (
                        <div className="flex flex-col gap-4">
                            {/* Clarification Alert */}
                            {(() => {
                                const clarificationLog = request.logs
                                    ?.slice()
                                    .reverse()
                                    .find((log) => log.status === "Needs Clarification");
                                if (!clarificationLog) return null;
                                return (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col gap-1.5 text-sm">
                                        <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                                            <HelpCircle className="h-4 w-4" />
                                            Clarification Requested
                                        </span>
                                        <p className="text-slate-300 italic">
                                            "{clarificationLog.message || "Please edit and resubmit with corrected information."}"
                                        </p>
                                        {clarificationLog.updatedBy && (
                                            <span className="text-[11px] text-slate-500">
                                                Requested by {clarificationLog.updatedBy.name || clarificationLog.updatedBy} on {new Date(clarificationLog.timestamp).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        )}
                                    </div>
                                );
                            })()}

                            <div className="flex flex-col gap-1.5">
                                <label className="FormLabel">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                    className="FormInput"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="FormLabel">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    className="FormInput h-28"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="FormLabel">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="FormSelect"
                                    >
                                        <option value="IT">IT</option>
                                        <option value="HR">HR</option>
                                        <option value="Facilities">Facilities</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Security">Security</option>
                                        <option value="Learning & Development">Learning & Development</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="FormLabel">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="FormSelect"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* <div className="flex flex-col gap-1.5">
                                <label className="FormLabel">Clarification Notes (Optional)</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="FormInput h-24"
                                    placeholder="Explain how you addressed the clarification requested..."
                                />
                            </div> */}
                        </div>
                    )}

                    {/* REVIEW */}
                    {mode === "review" && request && (
                        <div className="flex flex-col gap-4">

                            <div className="text-white font-semibold">
                                {request.title}
                            </div>

                            <div className="flex gap-2">
                                {["Approved", "Needs Clarification", "Rejected"].map(
                                    (s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setReviewStatus(s)}
                                            className={`px-3 py-2 rounded ${reviewStatus === s
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-800 text-slate-400"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    )
                                )}
                            </div>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="FormInput h-24"
                                placeholder="Message"
                            />

                        </div>
                    )}

                    {/* ADMIN ACTION */}
                    {(mode === "close-confirm" || mode === "reopen-confirm") && (
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="FormInput h-24"
                            placeholder="Optional message"
                        />
                    )}

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-4 shrink-0">

                        <button type="button" onClick={onClose} className="FormButtonSecondary">
                            Cancel
                        </button>

                        {mode !== "details" && (
                            <button type="submit" className="FormButtonPrimary">
                                {mode === "review" ? "Post" : "Submit"}
                            </button>
                        )}

                    </div>

                </form>
            </div>
        </div>
    );
};

export default RequestModal;