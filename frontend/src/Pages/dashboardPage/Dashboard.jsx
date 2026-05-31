import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Loader2, AlertCircle } from "lucide-react";

import { UserDashboard } from "../userDashboardPage/UserDashboard";
import { ManagerDashboard } from "../userDashboardPage/ManagerDashboard";
import { AdminDashboard } from "../userDashboardPage/AdminDashboard";
import { RequestModal } from "../../Component/RequestModal";

import { logout } from "../../redux/features/auth/authSlice";

const API_BASE_URL =
    import.meta.env.VITE_BASE_API_URL ||
    "http://localhost:5000";

const initialFilters = {
    status: "",
    category: "",
    priority: "",
    startDate: "",
    endDate: "",
};

// ---------------- HELPERS ----------------
const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

const getHeaders = () => {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        Authorization: token
            ? `Bearer ${token}`
            : "",
    };
};

export const DashboardPage = () => {
    const dispatch = useDispatch();

    const user = useSelector(
        (state) => state.auth.user
    );

    // ---------------- STATES ----------------
    const [requests, setRequests] =
        useState([]);

    const [selectedRequest, setSelectedRequest] =
        useState(null);

    const [activeRequest, setActiveRequest] =
        useState(null);

    const [filters, setFilters] =
        useState(initialFilters);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [modalMode, setModalMode] =
        useState("details");
    const [modalInitialReviewStatus, setModalInitialReviewStatus] =
        useState(null);

    // ---------------- FETCH REQUESTS ----------------
    const fetchRequestsFromAPI =
        async () => {
            if (!user) return;

            setIsLoading(true);
            setError("");

            try {
                const activeFilters =
                    {};

                Object.entries(
                    filters
                ).forEach(
                    ([key, value]) => {
                        if (
                            value &&
                            key !== "status"
                        ) {
                            activeFilters[
                                key
                            ] = value;
                        }
                    }
                );

                const query =
                    Object.keys(
                        activeFilters
                    ).length > 0
                        ? `?${new URLSearchParams(
                            activeFilters
                        )}`
                        : "";

                const response =
                    await axios.get(
                        `${API_BASE_URL}/api/requests${query}`,
                        {
                            headers:
                                getHeaders(),
                        }
                    );

                setRequests(
                    response.data.data
                );
            } catch (err) {
                const message =
                    err.response?.data
                        ?.message ||
                    "Failed to load requests.";

                setError(message);

                if (
                    err.response
                        ?.status === 401 ||
                    err.response
                        ?.status === 403
                ) {
                    dispatch(logout());
                }
            } finally {
                setIsLoading(false);
            }
        };

    // ---------------- FETCH REQUEST DETAILS ----------------
    const fetchRequestDetailsFromAPI =
        async (id) => {
            setError("");

            try {
                const response =
                    await axios.get(
                        `${API_BASE_URL}/api/requests/${id}`,
                        {
                            headers:
                                getHeaders(),
                        }
                    );

                const request =
                    response.data.data;

                setSelectedRequest(
                    request
                );

                setActiveRequest(
                    request
                );
            } catch (err) {
                setError(
                    err.response?.data
                        ?.message ||
                    "Failed to load request details."
                );
            }
        };

    // ---------------- CREATE REQUEST ----------------
    const createRequestAPI =
        async (requestData) => {
            setError("");

            try {
                await axios.post(
                    `${API_BASE_URL}/api/requests`,
                    requestData,
                    {
                        headers:
                            getHeaders(),
                    }
                );

                await fetchRequestsFromAPI();
            } catch (err) {
                const message =
                    err.response?.data
                        ?.message ||
                    "Failed to create request.";

                setError(message);

                throw err;
            }
        };

    // ---------------- UPDATE REQUEST STATUS ----------------
    const updateRequestStatusAPI =
        async (id, payload) => {
            setError("");

            try {
                await axios.put(
                    `${API_BASE_URL}/api/requests/${id}/status`,
                    payload,
                    {
                        headers:
                            getHeaders(),
                    }
                );

                await fetchRequestsFromAPI();

                if (
                    activeRequest?._id ===
                    id
                ) {
                    await fetchRequestDetailsFromAPI(
                        id
                    );
                }
            } catch (err) {
                const message =
                    err.response?.data
                        ?.message ||
                    "Failed to update request status.";

                setError(message);

                throw err;
            }
        };

    // ---------------- USE EFFECT ----------------
    useEffect(() => {
        if (user) {
            fetchRequestsFromAPI();
        }
    }, [
        user,
        filters.category,
        filters.priority,
        filters.startDate,
        filters.endDate,
    ]);

    // ---------------- MODAL HANDLERS ----------------
    const openModal = (
        mode,
        request = null,
        initialReviewStatus = null
    ) => {
        setModalMode(mode);
        setActiveRequest(request);
        setModalInitialReviewStatus(initialReviewStatus);
        setModalOpen(true);

        if (
            mode === "details" &&
            request
        ) {
            fetchRequestDetailsFromAPI(
                request._id
            );
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedRequest(null);
        setActiveRequest(null);
        setModalInitialReviewStatus(null);
    };

    // ---------------- SUBMIT HANDLERS ----------------
    const handleSubmitCreate =
        async (data) => {
            try {
                await createRequestAPI(
                    data
                );

                closeModal();
            } catch { }
        };

    const handleSubmitReview =
        async (data) => {
            if (!activeRequest)
                return;

            try {
                await updateRequestStatusAPI(
                    activeRequest._id,
                    {
                        status:
                            data.status,
                        message:
                            data.message,
                    }
                );

                closeModal();
            } catch { }
        };

    const handleSubmitResubmit =
        async (data) => {
            if (!activeRequest)
                return;

            try {
                await updateRequestStatusAPI(
                    activeRequest._id,
                    {
                        status:
                            "Submitted",
                        ...data,
                    }
                );

                closeModal();
            } catch { }
        };

    const handleSubmitAdminAction =
        async (message) => {
            if (!activeRequest)
                return;

            const status =
                modalMode ===
                    "close-confirm"
                    ? "Closed"
                    : "Reopened";

            try {
                await updateRequestStatusAPI(
                    activeRequest._id,
                    {
                        status,
                        message,
                    }
                );

                closeModal();
            } catch { }
        };

    // ---------------- FILTERS ----------------
    const handleFilterChange = (
        key,
        value
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFilterStatusToggle =
        (status) => {
            setFilters((prev) => ({
                ...prev,
                status,
            }));
        };

    const handleResetFilters = () => {
        setFilters(initialFilters);
    };

    // ---------------- RENDER DASHBOARD ----------------
    const renderDashboardByRole =
        () => {
            if (!user) return null;

            switch (
            user.role
            ) {
                case "Admin":
                    return (
                        <AdminDashboard
                            requests={
                                requests
                            }
                            filters={
                                filters
                            }
                            filterStatus={
                                filters.status
                            }
                            onFilterStatusSelect={
                                handleFilterStatusToggle
                            }
                            onFilterChange={
                                handleFilterChange
                            }
                            onResetFilters={
                                handleResetFilters
                            }
                            onViewDetails={(
                                request
                            ) =>
                                openModal(
                                    "details",
                                    request
                                )
                            }
                            onCloseRequest={(
                                request
                            ) =>
                                openModal(
                                    "close-confirm",
                                    request
                                )
                            }
                            onReopenRequest={(
                                request
                            ) =>
                                openModal(
                                    "reopen-confirm",
                                    request
                                )
                            }
                        />
                    );

                case "Manager":
                    return (
                        <ManagerDashboard
                            requests={
                                requests
                            }
                            filterStatus={
                                filters.status
                            }
                            onFilterStatusSelect={
                                handleFilterStatusToggle
                            }
                            onViewDetails={(
                                request
                            ) =>
                                openModal(
                                    "details",
                                    request
                                )
                            }
                            onReview={(
                                request
                            ) =>
                                openModal(
                                    "review",
                                    request
                                )
                            }
                            onSendMessage={(request) =>
                                openModal(
                                    "review",
                                    request,
                                    "Needs Clarification"
                                )
                            }
                        />
                    );

                default:
                    return (
                        <UserDashboard
                            requests={
                                requests
                            }
                            filterStatus={
                                filters.status
                            }
                            onFilterStatusSelect={
                                handleFilterStatusToggle
                            }
                            onViewDetails={(
                                request
                            ) =>
                                openModal(
                                    "details",
                                    request
                                )
                            }
                            onResubmit={(
                                request
                            ) =>
                                openModal(
                                    "resubmit",
                                    request
                                )
                            }
                            openCreateModal={() =>
                                openModal(
                                    "create"
                                )
                            }
                        />
                    );
            }
        };

    // ---------------- UI ----------------
    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="DashboardContainer h-screen w-screen flex flex-col">
            {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-100 text-rose-600">
                    <AlertCircle />
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                renderDashboardByRole()
            )}

            <RequestModal
                isOpen={modalOpen}
                onClose={closeModal}
                mode={modalMode}
                request={
                    selectedRequest ||
                    activeRequest
                }
                onSubmitCreate={
                    handleSubmitCreate
                }
                onSubmitReview={
                    handleSubmitReview
                }
                onSubmitResubmit={
                    handleSubmitResubmit
                }
                onSubmitAdminAction={
                    handleSubmitAdminAction
                }
                initialReviewStatus={modalInitialReviewStatus}
            />
        </div>
    );
};

export default DashboardPage;