// lib/store.ts
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
       user: userReducer,
    },
  })
}

// Define RootState and AppDispatch types
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']