import React from "react";
import { useAuth } from "../redux/store";
import {
    Menu,
    ClipboardList,
    ShieldAlert,
    Award,
    UserCheck,
} from "lucide-react";

export const Navbar = ({ onMenuToggle }) => {
    const { user } = useAuth();

    const getRoleIcon = () => {
        switch (user?.role) {
            case "Admin":
                return <ShieldAlert className="h-4 w-4 text-fuchsia-400" />;
            case "Manager":
                return <Award className="h-4 w-4 text-emerald-400" />;
            default:
                return <UserCheck className="h-4 w-4 text-sky-400" />;
        }
    };

    const getRoleBadgeClass = () => {
        switch (user?.role) {
            case "Admin":
                return "StatusBadge StatusReopened";
            case "Manager":
                return "StatusBadge StatusApproved";
            default:
                return "StatusBadge StatusSubmitted";
        }
    };

    return (
        <header className="HeaderContainer">
            <div className="flex items-center gap-4">

                <button
                    onClick={onMenuToggle}
                    className="text-slate-400 hover:text-white md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-2 md:hidden">
                    <ClipboardList className="h-5 w-5 text-indigo-500" />
                    <span className="text-md font-bold text-white">
                        RequestFlow
                    </span>
                </div>

            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-900 rounded-xl px-4 py-1.5">

                        <span className="hidden sm:inline text-xs text-slate-400">
                            {user.name} ({user.userId})
                        </span>

                        <div className={`${getRoleBadgeClass()} flex items-center gap-1.5 px-2.5 py-0.5`}>
                            {getRoleIcon()}
                            <span>{user.role}</span>
                        </div>

                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;