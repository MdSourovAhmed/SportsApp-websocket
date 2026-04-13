// import { create } from "zustand";

// const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

// export const useAppStore = create((set) => ({
//   // ── Admin auth ───────────────────────────────────────────────────────────
//   isAdmin: false,

//   login: (password) => {
//     if (password === ADMIN_PASSWORD) {
//       set({ isAdmin: true });
//       return true;
//     }
//     return false;
//   },

//   logout: () => set({ isAdmin: false }),
// }));




import { create } from "zustand";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export const useAppStore = create((set) => ({
  // ── Admin auth ───────────────────────────────────────────────────────────
  isAdmin: false,

  login: (password) => {
    if (password === ADMIN_PASSWORD) {
      set({ isAdmin: true });
      return true;
    }
    return false;
  },

  logout: () => set({ isAdmin: false }),
}));