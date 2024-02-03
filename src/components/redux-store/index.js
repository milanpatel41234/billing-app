import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Auth";
import ExpenseSlice from "./expenses";
import AuthPremiumSlice from "./AuthPremium";
import AlertSlice from "./Alert";

const store = configureStore({
  reducer: {
    Expense: ExpenseSlice.reducer,
    Auth: AuthSlice.reducer,
    AuthPremium: AuthPremiumSlice.reducer,
    Alert: AlertSlice.reducer,
  },
});
export const AuthAction = AuthSlice.actions;
export const ExpenseAction = ExpenseSlice.actions;
export const AuthPremiumAction = AuthPremiumSlice.actions;
export const AlertAction = AlertSlice.actions;
export default store;
