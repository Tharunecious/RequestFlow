import React from "react";
import { StatusCard } from "./StatusCard";

import {
    FileText,
    CheckCircle,
    XCircle,
    HelpCircle,
    Lock,
    RotateCcw,
} from "lucide-react";

// Default card config shared across all roles
const DEFAULT_STATUS_CARDS = [
    { title: "Submitted", statusType: "Submitted", icon: FileText },
    { title: "Clarification", statusType: "Needs Clarification", icon: HelpCircle },
    { title: "Approved", statusType: "Approved", icon: CheckCircle },
    { title: "Rejected", statusType: "Rejected", icon: XCircle },
    { title: "Reopened", statusType: "Reopened", icon: RotateCcw },
];

export const StatusMetrics = ({
    requests,
    filterStatus,
    onFilterStatusSelect,
    statusCards = DEFAULT_STATUS_CARDS,
    infoBarRight,
}) => {
    const countStatus = (status) => {
        return requests.filter((r) => r.status === status).length;
    };

    return (
        <>
            {/* KPI Cards */}
            <section className="sm:grid grid-cols-5 sm:gap-2 md:gap-4 hidden">
                {statusCards.map((card) => (
                    <StatusCard
                        key={card.statusType}
                        title={card.title}
                        value={countStatus(card.statusType)}
                        icon={card.icon}
                        statusType={card.statusType}
                        isActive={filterStatus === card.statusType}
                        onClick={() =>
                            onFilterStatusSelect(
                                filterStatus === card.statusType
                                    ? ""
                                    : card.statusType
                            )
                        }
                    />
                ))}
            </section>

        </>
    );
};

export default StatusMetrics;
