import React from 'react';
import {
    Clock,
    UserCheck,
    ShieldAlert,
    Award,
    FileSpreadsheet
} from 'lucide-react';

export const TimeLine = ({ logs }) => {
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

    const getActorIcon = (role) => {
        switch (role) {
            case 'Admin':
                return <ShieldAlert className="h-3 w-3 text-fuchsia-400" />;
            case 'Manager':
                return <Award className="h-3 w-3 text-emerald-400" />;
            default:
                return <UserCheck className="h-3 w-3 text-sky-400" />;
        }
    };

    const getTimelineDotColor = (status) => {
        switch (status) {
            case 'Submitted':
                return 'border-sky-500 bg-sky-950';
            case 'Approved':
                return 'border-emerald-500 bg-emerald-950';
            case 'Rejected':
                return 'border-rose-500 bg-rose-950';
            case 'Needs Clarification':
                return 'border-amber-500 bg-amber-950';
            case 'Closed':
                return 'border-slate-500 bg-slate-900';
            case 'Reopened':
                return 'border-fuchsia-500 bg-fuchsia-950';
            default:
                return 'border-slate-800 bg-slate-950';
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <section>
            <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Workflow Audit Logs
                </h3>
            </div>

            {logs && logs.length > 0 ? (
                <div className="TimelineContainer">
                    {logs.map((log, index) => (
                        <div key={index} className="TimelineItem">
                            <div
                                className={`TimelinePoint ${getTimelineDotColor(log.status)}`}
                            />

                            <div className="TimelineMeta">
                                <span className={getStatusBadgeClass(log.status)}>
                                    {log.status}
                                </span>

                                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                                    {getActorIcon(log.updatedBy?.role)}
                                    <span>
                                        {log.updatedBy?.name} ({log.updatedBy?.userId})
                                    </span>
                                </span>

                                <span className="text-[11px] text-slate-500 font-medium">
                                    {formatDate(log.timestamp)}
                                </span>
                            </div>

                            {log.message && (
                                <div className="TimelineContent">
                                    <p className="text-slate-300 text-[0.25rem] sm:text-[0.5rem] whitespace-pre-line leading-relaxed">
                                        {log.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-850 rounded-xl">
                    <FileSpreadsheet className="h-8 w-8 text-slate-600 mb-2" />
                    <p className="text-slate-400 text-sm font-medium">
                        No system history logs recorded.
                    </p>
                </div>
            )}
        </section>
    );
};