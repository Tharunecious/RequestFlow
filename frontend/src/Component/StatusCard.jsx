import React from 'react';

export const StatusCard = ({
    title,
    value,
    icon: Icon,
    statusType,
    isActive,
    onClick,
}) => {
    const getBadgeStyle = () => {
        switch (statusType) {
            case 'Submitted':
                return 'StatusSubmitted';
            case 'Approved':
                return 'StatusApproved';
            case 'Rejected':
                return 'StatusRejected';
            case 'Needs Clarification':
                return 'StatusNeedsClarification';
            case 'Closed':
                return 'StatusClosed';
            case 'Reopened':
                return 'StatusReopened';
            default:
                return '';
        }
    };

    const getBorderColor = () => {
        if (!isActive) return 'border-slate-900';

        switch (statusType) {
            case 'Submitted':
                return 'border-sky-500/55 bg-sky-950/10';
            case 'Approved':
                return 'border-emerald-500/55 bg-emerald-950/10';
            case 'Rejected':
                return 'border-rose-500/55 bg-rose-950/10';
            case 'Needs Clarification':
                return 'border-amber-500/55 bg-amber-950/10';
            case 'Closed':
                return 'border-slate-500/55 bg-slate-900/40';
            case 'Reopened':
                return 'border-fuchsia-500/55 bg-fuchsia-950/10';
            default:
                return '';
        }
    };

    const getIconColor = () => {
        switch (statusType) {
            case 'Submitted':
                return 'text-sky-400';
            case 'Approved':
                return 'text-emerald-400';
            case 'Rejected':
                return 'text-rose-400';
            case 'Needs Clarification':
                return 'text-amber-400';
            case 'Closed':
                return 'text-slate-400';
            case 'Reopened':
                return 'text-fuchsia-400';
            default:
                return 'text-indigo-400';
        }
    };

    return (
        <article
            onClick={onClick}
            className={`KpiCard ${getBorderColor()} 
                }`}
        >
            <div className="KpiHeader">
                <span className="text-slate-400">{title}</span>
                <div className={`p-1.5 ${getIconColor()}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            <div className="flex justify-between mt-2">
                <span className="KpiValue">{value}</span>
                <span className={`StatusBadge ${getBadgeStyle()}`}>Status</span>
            </div>
        </article>
    );
};