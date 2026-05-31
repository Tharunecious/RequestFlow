import React, { useState, useRef, useEffect, useMemo } from "react";
import { DashboardHeader } from "../../Component/DashboardHeader";
import { StatusMetrics } from "../../Component/StatusMetrics";
import { DataTable } from "../../Component/DataTable";
import { useDispatch } from "react-redux";

import {
    Eye,
    CheckCircle,
    RotateCcw,
    Search,
    FilterX,
    LogOut,
    ChevronDown,
    Calendar,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// ==========================================
// Custom Dropdown Component (Premium UI)
// ==========================================
const CustomDropdown = ({ label, value, options, onChange, placeholder = "Select option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="flex flex-col gap-0.5 sm:gap-1.5 relative w-full" ref={containerRef}>
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl px-2 sm:px-4 py-2.5 text-left text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all flex items-center justify-between cursor-pointer"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
                    <div className="overflow-hidden rounded-xl p-1.5 animate-in fade-in duration-100">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center justify-between cursor-pointer ${option.value === value
                                    ? "bg-indigo-600/20 text-indigo-400 font-medium"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                            >
                                <span>{option.label}</span>
                                {option.value === value && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// Custom Date Picker (Calendar UI)
// ==========================================
const CustomDatePicker = ({
    label,
    value,
    onChange,
    placeholder = "Select date",
    minDate,
    maxDate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    useEffect(() => {
        if (value) {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) {
                setCurrentYear(parsed.getFullYear());
                setCurrentMonth(parsed.getMonth());
            }
        }
    }, [value, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = (e) => {
        e.preventDefault();
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = (e) => {
        e.preventDefault();
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const totalDays = getDaysInMonth(currentYear, currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

    const formatDateStr = (year, month, day) => {
        const mm = String(month + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${year}-${mm}-${dd}`;
    };

    const getDisplayDate = (dateString) => {
        if (!dateString) return placeholder;
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return placeholder;
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return placeholder;
        }
    };

    const isDayDisabled = (year, month, day) => {
        const dateStr = formatDateStr(year, month, day);
        const currentDate = new Date(dateStr + "T00:00:00");

        if (minDate) {
            const minD = new Date(minDate + "T00:00:00");
            if (currentDate < minD) return true;
        }
        if (maxDate) {
            const maxD = new Date(maxDate + "T00:00:00");
            if (currentDate > maxD) return true;
        }
        return false;
    };

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
        days.push(d);
    }

    return (
        <div className="flex flex-col gap-0.5 sm:gap-1.5 relative w-full" ref={containerRef}>
            <label className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-left text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all flex items-center justify-between cursor-pointer"
            >
                <span className={`truncate ${value ? "text-slate-200" : "text-slate-500"}`}>
                    {getDisplayDate(value)}
                </span>
                <Calendar className="h-4 w-4 text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <h4 className="font-semibold text-slate-200 text-sm">
                            {monthNames[currentMonth]} {currentYear}
                        </h4>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} />;
                            }

                            const dateStr = formatDateStr(currentYear, currentMonth, day);
                            const isSelected = value === dateStr;
                            const isDisabled = isDayDisabled(currentYear, currentMonth, day);

                            return (
                                <button
                                    key={`day-${day}`}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChange(dateStr);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all duration-100 cursor-pointer
                                        ${isSelected
                                            ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20"
                                            : isDisabled
                                                ? "text-slate-700 bg-slate-900/10 cursor-not-allowed opacity-30"
                                                : "text-slate-300 hover:bg-slate-900 hover:text-white"
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-900/50 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                const today = new Date();
                                const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                                if (
                                    (!minDate || new Date(todayStr + "T00:00:00") >= new Date(minDate + "T00:00:00")) &&
                                    (!maxDate || new Date(todayStr + "T00:00:00") <= new Date(maxDate + "T00:00:00"))
                                ) {
                                    onChange(todayStr);
                                    setIsOpen(false);
                                }
                            }}
                            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Select Today
                        </button>
                        {value && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChange("");
                                    setIsOpen(false);
                                }}
                                className="text-[10px] font-semibold text-slate-500 hover:text-slate-400 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminDashboard = ({
    requests,
    filters,
    filterStatus,
    onFilterStatusSelect,
    onFilterChange,
    onResetFilters,
    onViewDetails,
    onCloseRequest,
    onReopenRequest,
}) => {
    const dispatch = useDispatch();

    const logout = () => {
        dispatch({ type: "auth/logout" });
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    };

    // Date Logic / Invalid selection protection
    const handleStartDateChange = (newStartDate) => {
        if (newStartDate && filters.endDate && newStartDate > filters.endDate) {
            onFilterChange("endDate", "");
        }
        onFilterChange("startDate", newStartDate);
    };

    const handleEndDateChange = (newEndDate) => {
        if (newEndDate && filters.startDate && newEndDate < filters.startDate) {
            onFilterChange("startDate", "");
        }
        onFilterChange("endDate", newEndDate);
    };

    // Client-side filtering by status
    const displayedRequests = useMemo(() => {
        if (!filterStatus) return requests;
        return requests.filter((r) => r.status === filterStatus);
    }, [requests, filterStatus]);

    // Count helpers for the summary bar (metrics cards are computed from raw requests)
    const getApprovedCount = () => {
        return requests.filter((r) => r.status === "Approved").length;
    };

    const getClosedCount = () => {
        return requests.filter((r) => r.status === "Closed").length;
    };

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

    const hasAdvancedFilters =
        filters.category ||
        filters.priority ||
        filters.startDate ||
        filters.endDate ||
        filterStatus;

    // Shared grid layout for DataTable - ensures perfect header-body alignment
    const gridTemplateColumns = 'auto auto auto auto auto auto auto auto';

    // Filter Options Definitions
    const categoryOptions = [
        { value: "", label: "All Categories" },
        { value: "IT", label: "IT" },
        { value: "HR", label: "HR" },
        { value: "Finance", label: "Finance" },
    ];

    const priorityOptions = [
        { value: "", label: "All Priorities" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
    ];

    const statusOptions = [
        { value: "", label: "All Statuses" },
        { value: "Submitted", label: "Submitted" },
        { value: "Needs Clarification", label: "Needs Clarification" },
        { value: "Approved", label: "Approved" },
        { value: "Rejected", label: "Rejected" },
        { value: "Closed", label: "Closed" },
        { value: "Reopened", label: "Reopened" },
    ];

    // Table column definitions
    const columns = [
        {
            key: "reqId",
            header: "Req ID",
            headerClassName: "",
            cellClassName: "font-mono font-semibold text-xs text-indigo-400",
            render: (req) =>
                `#${req._id.substring(req._id.length - 6).toUpperCase()}`,
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
        {
            key: "priority",
            header: "Priority",
            render: (req) => (
                <span className={getPriorityBadgeClass(req.priority)}>
                    {req.priority}
                </span>
            ),
        },
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
            key: "submittedBy",
            header: "Submitted By",
            render: (req) => (
                <>
                    <div className="font-semibold text-slate-300 text-xs">
                        {req.submittedBy?.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                        {req.submittedBy?.userId}
                    </div>
                </>
            ),
        },
        {
            key: "createdAt",
            header: "Date",
            cellClassName: "text-xs text-slate-500",
            render: (req) => formatDate(req.createdAt),
        },
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
                        <span className="hidden min-[450px]:inline sm:inline">Details</span>
                    </button>

                    {onCloseRequest && req.status === "Approved" && (
                        <button
                            onClick={() => onCloseRequest(req)}
                            className="FormButtonDanger py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                        >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="hidden min-[450px]:inline sm:inline">Close</span>
                        </button>
                    )}

                    {onReopenRequest && req.status === "Closed" && (
                        <button
                            onClick={() => onReopenRequest(req)}
                            className="FormButtonPrimary py-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden min-[450px]:inline sm:inline">Reopen</span>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-4 sm:gap-6 h-full overflow-hidden p-2 sm:p-6">
            <DashboardHeader
                title="Welcome, Admin!"
                subtitle="Manage and monitor all requests"
                actions={
                    <button
                        onClick={logout}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-[0.7rem] sm:text-base bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                        <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                        Logout
                    </button>
                }
            />

            <StatusMetrics
                requests={requests}
                filterStatus={filterStatus}
                onFilterStatusSelect={onFilterStatusSelect}
                infoBarRight={
                    <div className="flex gap-4">
                        <div>
                            Approved:{" "}
                            <strong className="text-green-400">
                                {getApprovedCount()}
                            </strong>
                        </div>
                        <div>
                            Closed:{" "}
                            <strong>{getClosedCount()}</strong>
                        </div>
                    </div>
                }
            />

            {/* Advanced Filters Panel */}
            <section className="bg-slate-900/20 border border-slate-900 p-2 rounded-2xl backdrop-blur-md flex flex-col gap-4">
                {/* <div className="flex items-center gap-2 border-b border-slate-900/50 pb-2">
                    <Search className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Advanced Filtering Panel
                    </h3>
                </div> */}

                <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                    {/* Category Dropdown */}
                    <CustomDropdown
                        label="Category"
                        value={filters.category}
                        options={categoryOptions}
                        onChange={(val) => onFilterChange("category", val)}
                    />

                    {/* Priority Dropdown */}
                    <CustomDropdown
                        label="Priority"
                        value={filters.priority}
                        options={priorityOptions}
                        onChange={(val) => onFilterChange("priority", val)}
                    />

                    {/* Status Dropdown */}
                    <CustomDropdown
                        label="Status"
                        value={filterStatus || ""}
                        options={statusOptions}
                        onChange={(val) => onFilterStatusSelect(val)}
                    />

                    {/* Start Date Selection */}
                    <CustomDatePicker
                        label="Start Date"
                        value={filters.startDate}
                        onChange={handleStartDateChange}
                        maxDate={filters.endDate}
                    />

                    {/* End Date Selection */}
                    <CustomDatePicker
                        label="End Date"
                        value={filters.endDate}
                        onChange={handleEndDateChange}
                        minDate={filters.startDate}
                    />
                </div>

                {/* Reset Buttons Panel */}
                {/* {hasAdvancedFilters && (
                    <div className="flex justify-end border-t border-slate-900/50 pt-3">
                        <button
                            onClick={onResetFilters}
                            className="flex items-center gap-2 text-xs px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg"
                        >
                            <FilterX className="h-3.5 w-3.5" />
                            Clear All Filters
                        </button>
                    </div>
                )} */}
            </section>

            <DataTable
                columns={columns}
                data={displayedRequests}
                maxHeight="100%"
                gridTemplateColumns={gridTemplateColumns}
            />
        </div>
    );
};

export default AdminDashboard;