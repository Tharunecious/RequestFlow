import React from "react";

export const DashboardHeader = ({ title, subtitle, actions }) => {
    return (
        <section className="flex flex-wrap items-center justify-between gap-0 sm:gap-4">
            <div>
                <h2 className="text-[1rem] sm:text-xl font-bold text-white tracking-wide">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-[0.6rem] sm:text-xs text-slate-400">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </section>
    );
};

export default DashboardHeader;
