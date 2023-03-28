import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appApi from "../services/appApi";


export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        // save user after signup
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, { payload }) => payload);
        // save user after login
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => payload);
    },
});
export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
