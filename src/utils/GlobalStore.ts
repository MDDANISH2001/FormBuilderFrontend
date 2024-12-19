import { create } from "zustand";

interface IGlobalStore {
  isLoginSuccess: boolean;
  setIsLoginSuccess: (isLoginSuccess: boolean) => void;
}

const initialState = {
  isLoginSuccess: false,
};

export const useGlobalStore = create<IGlobalStore>((set) => ({
  ...initialState,
  setIsLoginSuccess: (isLoginSuccess) =>
    set({ isLoginSuccess: isLoginSuccess }),
}));
