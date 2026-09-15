import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    // ── Add more slices here ─────────────────────────────────
    // auth: authReducer,
    // ui:   uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ── Inferred Types ───────────────────────────────────────────
export type RootState    = ReturnType<typeof store.getState>;
export type AppDispatch  = typeof store.dispatch;
