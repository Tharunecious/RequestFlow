import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

import {
    LayoutDashboard,
    PlusCircle,
    LogOut,
    X,
    ClipboardList,
} from "lucide-react";

export const Sidebar = ({ isOpen, setIsOpen, openCreateModal }) => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div
                    className="SidebarMobileOverlay"
                    onClick={closeSidebar}
                />
            )}

            <aside
                className={`SidebarContainer ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <header className="SidebarHeader">

                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                            <ClipboardList className="h-5 w-5 text-white" />
                        </div>

                        <div>
                            <span className="text-lg font-bold text-white">
                                Request<span className="text-indigo-400">Flow</span>
                            </span>
                            <p className="text-[10px] text-slate-500">
                                Approval Suite
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={closeSidebar}
                        className="ml-auto text-slate-400 hover:text-white md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>

                </header>

                <nav className="SidebarNav">

                    <NavLink
                        to="/dashboard"
                        end
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            isActive ? "SidebarItemActive" : "SidebarItem"
                        }
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                    </NavLink>

                    {user?.role === "User" && (
                        <button
                            onClick={() => {
                                closeSidebar();
                                openCreateModal();
                            }}
                            className="SidebarItem"
                        >
                            <PlusCircle className="h-5 w-5 text-indigo-400" />
                            <span>Create Request</span>
                        </button>
                    )}

                    <div className="my-4 border-t border-slate-900" />

                    <div className="mt-auto p-4 rounded-xl bg-slate-950/50 border border-slate-900">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-slate-400">
                                Logged in as
                            </span>
                        </div>

                        <p className="text-sm font-semibold text-white truncate">
                            {user?.name}
                        </p>

                        <p className="text-xs text-indigo-400">
                            {user?.role} • {user?.userId}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="SidebarItem mt-3 text-rose-400"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>

                </nav>
            </aside>
        </>
    );
};

export default Sidebar;