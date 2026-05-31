import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/features/auth/authSlice";
import loginUiImg from "../../assets/login-ui.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
    ClipboardList,
    AlertCircle,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Check,
} from "lucide-react";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [role, setRole] =
        useState("User");

    const [rememberMe, setRememberMe] =
        useState(false);

    const [formError, setFormError] =
        useState("");

    const [
        roleDropdownOpen,
        setRoleDropdownOpen,
    ] = useState(false);

    // CHANGED REDUX CONCEPT
    const dispatch = useDispatch();

    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const navigate = useNavigate();

    // Navigate after login
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    // Clear error when input changes
    useEffect(() => {
        if (formError) {
            setFormError("");
        }
    }, [email, password, role]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedPassword =
            password.trim();

        if (
            !trimmedEmail ||
            !trimmedPassword
        ) {
            setFormError(
                "Email and password are required"
            );
            return;
        }

        try {
            const response =
                await axios.post(
                    `${import.meta.env
                        .VITE_BASE_API_URL
                    }/api/auth/login`,
                    {
                        email: trimmedEmail,
                        password: trimmedPassword,
                        role,
                    }
                );

            const data = response.data;

            if (data.success) {
                const token =
                    data.data.token;

                const decoded =
                    jwtDecode(token);

                const user = {
                    id:
                        decoded.id ||
                        decoded._id ||
                        "",

                    userId:
                        decoded.userId,

                    email:
                        decoded.email,

                    name:
                        decoded.name,

                    role:
                        decoded.role,
                };

                // Save token
                if (rememberMe) {
                    localStorage.setItem(
                        "token",
                        token
                    );

                    sessionStorage.removeItem(
                        "token"
                    );
                } else {
                    sessionStorage.setItem(
                        "token",
                        token
                    );

                    localStorage.removeItem(
                        "token"
                    );
                }

                dispatch(
                    loginSuccess({
                        token,
                        user,
                    })
                );
            } else {
                setFormError(
                    data.message
                );
            }
        } catch (error) {
            if (
                axios.isAxiosError(error)
            ) {
                setFormError(
                    error.response?.data
                        ?.message ||
                    "Login failed"
                );
            } else {
                setFormError(
                    "Login failed"
                );
            }
        }
    };

    return (
        <div className="AuthContainer flex flex-row gap-0 p-0 items-stretch h-screen max-h-screen w-screen bg-gradient-to-br from-slate-100 to-slate-50">

            {/* Left Column: Premium Logo and Showcase (Shown on mobile, 50% on tablet & up) */}
            <section className="LoginImageContainer hidden md:flex md:w-1/2 flex-col items-center justify-center relative overflow-hidden select-none h-full gap-4">
                <div className="flex flex-col items-center text-center z-20 max-w-xs gap-2">

                    {/* Circular Div with Task Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-200 shadow-sm bg-violet-50">
                        <ClipboardList className="h-6 w-6 text-indigo-600" />
                    </div>

                    {/* Title */}
                    <h2 className="text-[1.5rem] font-extrabold tracking-tight text-slate-900 mt-1">
                        Request<span className="text-indigo-600">Flow</span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[12px] font-semibold text-slate-450 tracking-wider uppercase">
                        Request & Approval Management System
                    </p>

                    {/* Horizontal Line */}
                    <div className="w-4 h-0.5 bg-indigo-600 rounded-full my-0.5 mx-auto" />

                    {/* Quote */}
                    <p className="text-[0.8rem] text-slate-600 font-small leading-relaxed px-4">
                        Submit request, track status, get approvals and manage everything in one place.
                    </p>
                </div>

                {/* Showcase Image */}
                <div className="w-full flex items-center justify-center z-20 mt-2 overflow-hidden">
                    <img
                        src={loginUiImg}
                        alt="RequestFlow Login UI Layout"
                        className="max-h-[35vh] md:max-h-[40vh] lg:max-h-[60vh] object-contain rounded-xl"
                    />
                </div>
            </section>

            {/* Right Column: Login Form (Hidden below tablet, 50% on tablet & up) */}
            <section className="LoginFormContainer sm:m-4 flex w-full md:w-1/2 items-center justify-center relative overflow-y-auto h-full">
                <div className="w-[90%] sm:w-[80%] bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-md flex flex-col md:gap-4 gap-3 z-20 text-base">

                    {/* Mobile Branding Section (Shown only on mobile, hidden on md and up) */}
                    <div className="md:hidden flex flex-col items-center text-center md:gap-2 gap-1">
                        {/* Circular Div with Task Icon */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-200 shadow-sm bg-violet-50">
                            <ClipboardList className="h-6 w-6 text-indigo-600" />
                        </div>

                        {/* Title */}
                        <h2 className="md:text-[1.5rem] text-[1.25rem] font-extrabold tracking-tight text-slate-900 ">
                            Request<span className="text-indigo-600">Flow</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="md:text-[12px] text-[10px] font-semibold text-slate-450 tracking-wider uppercase">
                            Request & Approval Management System
                        </p>

                        {/* Horizontal Line */}
                        <div className="w-4 h-[2px] bg-indigo-600 rounded-full my-0.5 mx-auto" />
                    </div>

                    {/* Header Container */}
                    <div className="flex flex-col gap-1 text-center">
                        <h1 className="md:text-2xl text-xl font-extrabold text-slate-900 tracking-tight">
                            Welcome back!
                        </h1>
                        <p className="md:text-sm text-xs text-slate-500 font-medium">
                            Login to continue to your account.
                        </p>
                    </div>

                    {formError && (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:gap-4 gap-2">

                        {/* Form Fields */}
                        <div className="flex flex-col md:gap-3 gap-2">

                            {/* Email */}
                            <div className="FormField ">
                                <label
                                    htmlFor="email"
                                    className="md:text-[12px] text-[10px] font-bold text-slate-700 uppercase tracking-wider"
                                >
                                    Email Address
                                </label>

                                <div className="relative flex items-center">
                                    <Mail className="absolute left-3.5 md:h-4.5 md:w-4.5 h-4 w-4 text-slate-400 pointer-events-none" />

                                    <input
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); if (formError) setFormError(''); }}
                                        onKeyDown={(e) => {
                                            if (e.key === " ") e.preventDefault();
                                        }}
                                        placeholder="Enter your email"
                                        className="w-full bg-transparent border border-slate-200 rounded-lg pl-10 pr-3.5 py-2.5 md:text-sm text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="FormField flex flex-col md:gap-1.5 gap-1">
                                <label
                                    htmlFor="password"
                                    className="md:text-[12px] text-[10px] font-bold text-slate-700 uppercase tracking-wider"
                                >
                                    Password
                                </label>

                                <div className="relative flex items-center">
                                    <Lock className="absolute left-3.5 md:h-4.5 md:w-4.5 h-4 w-4 text-slate-400 pointer-events-none" />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); if (formError) setFormError(''); }}
                                        onKeyDown={(e) => {
                                            if (e.key === " ") e.preventDefault();
                                        }}
                                        maxLength={20}
                                        placeholder="Enter your password"
                                        className="w-full bg-transparent border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 md:text-sm text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none flex items-center justify-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4.5 w-4.5" />
                                        ) : (
                                            <Eye className="h-4.5 w-4.5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Custom Role Dropdown */}
                            <div className="FormField relative flex flex-col gap-1.5">
                                <label
                                    htmlFor="role-select"
                                    className="md:text-[12px] text-[10px] font-bold text-slate-700 uppercase tracking-wider"
                                >
                                    Role
                                </label>

                                <button
                                    id="role-select"
                                    type="button"
                                    onClick={() => { setRoleDropdownOpen(!roleDropdownOpen); if (formError) setFormError(''); }}
                                    className="w-full bg-transparent border border-slate-200 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-slate-800 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                >
                                    <span className="flex items-center gap-2 md:text-sm text-xs">
                                        <User className="h-4 w-4 text-slate-500" />
                                        {role}
                                    </span>

                                    <span className="text-[10px] text-slate-400 absolute right-3.5 pointer-events-none">
                                        ▼
                                    </span>
                                </button>

                                {roleDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={() => setRoleDropdownOpen(false)}
                                        />

                                        <ul className="absolute z-40 left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl text-sm overflow-hidden py-1">
                                            {["User", "Manager", "Admin"].map((r) => {
                                                const isSelected = role === r;

                                                return (
                                                    <li key={r}>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRole(r);
                                                                setRoleDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 flex items-center justify-between transition-all cursor-pointer font-medium ${isSelected
                                                                ? "bg-indigo-600 text-white font-semibold"
                                                                : "text-slate-700 hover:bg-indigo-50"
                                                                }`}
                                                        >
                                                            <span className="flex items-center gap-2">

                                                                {r}
                                                            </span>

                                                            {isSelected && (
                                                                <Check className="h-4 w-4 shrink-0 text-white" />
                                                            )}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-1 sm:gap-2 py-0.5 mt-0.5">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="sm:h-4 sm:w-4 h-3 w-3 rounded border border-slate-200 cursor-pointer accent-indigo-600"
                                />

                                <label
                                    htmlFor="remember"
                                    className="sm:text-[13px] text-[11px] text-slate-500 font-medium cursor-pointer select-none"
                                >
                                    Remember me
                                </label>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={
                                !!formError ||
                                !email ||
                                !password
                            }
                            className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg sm:py-2.5 py-2 sm:px-4 px-2 shadow-md shadow-indigo-600/10 transition-all cursor-pointer disabled:cursor-default disabled:opacity-70"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default LoginPage;