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
            <div className="flex-1 min-h-0 overflow-auto CustomScrollbar">
                <table className="min-w-[1000px] w-full border-collapse">

                    {/* Header */}
                    <thead className="sticky top-0 bg-slate-900 border-b border-slate-800">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={`header-${col.key}`}
                                    className={`
                                px-2 py-3
                                text-left
                                text-sm
                                font-semibold
                                text-slate-300
                                whitespace-nowrap
                                min-w-0
                                ${col.headerClassName || ""}
                            `}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {data?.length > 0 ? (
                            data.map((row, index) => (
                                <tr
                                    key={keyExtractor(row, index)}
                                    className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`
                                        sm:px-2 sm:py-3
                                        px-1 py-2
                                        text-sm
                                        text-slate-200
                                        min-w-0
                                        ${col.cellClassName || ""}
                                    `}
                                        >
                                            {col.render ? (
                                                col.render(row)
                                            ) : (
                                                <div
                                                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                                                    title={
                                                        typeof row[col.key] === "string"
                                                            ? row[col.key]
                                                            : ""
                                                    }
                                                >
                                                    {row[col.key]}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="h-64"
                                >
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
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </section>
    );
};

export default DataTable;