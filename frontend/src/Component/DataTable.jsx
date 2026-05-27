import React from "react";
import { AlertTriangle } from "lucide-react";

export const DataTable = ({
    columns,
    data,
    keyExtractor = (row) => row._id,
    emptyMessage = "No requests match filters",
    emptyDescription = "Try adjusting filters or create a new request.",
    maxHeight = "100%",
    gridTemplateColumns = null, // Optional: provide shared grid for perfect alignment
}) => {
    // Use grid layout if gridTemplateColumns is provided, otherwise flex
    const useGrid = gridTemplateColumns !== null && gridTemplateColumns !== undefined;

    const headerContainerClass = useGrid ? 'grid w-full gap-0' : 'flex w-full';
    const rowClass = useGrid
        ? 'grid w-full gap-0 border-b border-slate-800 hover:bg-slate-900/50 transition-colors'
        : 'flex border-b border-slate-800 hover:bg-slate-900/50 transition-colors';

    const headerStyle = useGrid ? { gridTemplateColumns } : undefined;
    const rowStyle = useGrid ? { gridTemplateColumns } : undefined;

    return (
        <section className="flex flex-col flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
            {/* Header Section - No Scroll */}
            <div className="flex-shrink-0 bg-slate-900 border-b border-slate-800">
                <div className={headerContainerClass} style={headerStyle}>
                    {columns.map((col) => (
                        <div
                            key={`header-${col.key}`}
                            className={`
                                px-2 py-3
                                text-left
                                text-sm
                                font-semibold
                                text-slate-300
                                bg-slate-900
                                ${col.headerClassName || ""}
                            `}
                        >
                            <div className="truncate">
                                {col.header}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body Section - Scrollable Only */}
            <div
                className="flex-1 min-h-0 overflow-y-auto CustomScrollbar"
                style={{ maxHeight }}
            >
                {data?.length > 0 ? (
                    <div className="flex flex-col">
                        {data.map((row, index) => (
                            <div
                                key={keyExtractor(row, index)}
                                className={rowClass}
                                style={rowStyle}
                            >
                                {columns.map((col) => (
                                    <div
                                        key={col.key}
                                        className={`
                                            px-2 py-3
                                            text-sm
                                            text-slate-200
                                            ${useGrid ? 'overflow-hidden' : ''}
                                            ${col.headerClassName || ""}
                                            ${col.cellClassName || ""}
                                        `}
                                    >
                                        {col.render ? (
                                            col.render(row)
                                        ) : (
                                            <div
                                                className="
                                                    overflow-hidden
                                                    text-ellipsis
                                                    whitespace-nowrap
                                                "
                                                title={
                                                    typeof row[
                                                        col.key
                                                    ] ===
                                                        "string"
                                                        ? row[
                                                        col
                                                            .key
                                                        ]
                                                        : ""
                                                }
                                            >
                                                {row[col.key]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-2 text-center text-slate-500">
                            <AlertTriangle className="h-8 w-8" />
                            <p className="font-semibold">
                                {emptyMessage}
                            </p>
                            <p className="text-xs text-slate-600">
                                {emptyDescription}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DataTable;