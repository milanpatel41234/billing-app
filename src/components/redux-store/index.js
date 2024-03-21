import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Auth";
import InvoiceSlice from "./invoice";
import FinancialYearSlice from "./FinancialYear";

const store = configureStore({
  reducer: {
    Auth: AuthSlice.reducer,
    Invoice: InvoiceSlice.reducer,
    FinancialYear:FinancialYearSlice.reducer,
  },
});
export const AuthAction = AuthSlice.actions;
export const InvoiceActions = InvoiceSlice.actions;
export const FinancialYearActions = FinancialYearSlice.actions;
export default store;
