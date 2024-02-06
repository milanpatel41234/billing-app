import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Auth";

const store = configureStore({
  reducer: {
    Auth: AuthSlice.reducer,
  },
});
export const AuthAction = AuthSlice.actions;
export default store;
