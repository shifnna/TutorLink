import { create } from "zustand";

interface UIState {
  isRouteLoading: boolean;
  setRouteLoading: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isRouteLoading: false,
  setRouteLoading: (value) => set({ isRouteLoading: value }),
}));