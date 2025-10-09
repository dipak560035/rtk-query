import { configureStore } from "@reduxjs/toolkit";
import { meatApi } from "../features/meals/meatApi";





export const store = configureStore({
  reducer:{
    [meatApi.reducerPath]:meatApi.reducer,
  },

   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      meatApi.middleware
    ]),

})