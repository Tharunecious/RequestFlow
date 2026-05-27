import { createSlice } from '@reduxjs/toolkit';

const initialFilters = {
    status: '',
    category: '',
    priority: '',
    startDate: '',
    endDate: '',
};

const initialState = {
    requests: [],
    selectedRequest: null,
    filters: initialFilters,
};

const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        setRequests(state, action) {
            state.requests = action.payload;
        },
        setSelectedRequest(state, action) {
            state.selectedRequest = action.payload;
        },
        updateRequest(state, action) {
            const index = state.requests.findIndex(
                (r) => r._id === action.payload._id
            );
            if (index !== -1) {
                state.requests[index] = action.payload;
            }
        },
        setFilter(state, action) {
            state.filters[action.payload.key] = action.payload.value;
        },
        resetFilters(state) {
            state.filters = initialFilters;
        },
        clearSelectedRequest(state) {
            state.selectedRequest = null;
        },
    },
});

export const {
    setRequests,
    setSelectedRequest,
    updateRequest,
    setFilter,
    resetFilters,
    clearSelectedRequest,
} = requestSlice.actions;

export default requestSlice.reducer;