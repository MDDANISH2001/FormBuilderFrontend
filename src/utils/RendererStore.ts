import { create } from "zustand";

interface CategorizeData {
  items: string[]; // Only items array required
}

interface ClozeData {
  sentence: string;
}

interface RendererStore {
  categorize: Record<string, CategorizeData>;
  cloze: Record<string, ClozeData>;
  comprehension: Record<string, string>; // Ensuring it's a flat key-value object
  setCategorizeData: (questionId: string, items: string[]) => void;
  setClozeData: (questionId: string, sentence: string) => void;
  setComprehensionData: (mcqId: string, selectedOption: string) => void;
  getPayload: () => {
    categorize: Record<string, CategorizeData>;
    cloze: Record<string, ClozeData>;
    comprehension: Record<string, string>; // Keep this consistent with the comprehension type
  };
}

export const useRendererStore = create<RendererStore>((set, get) => ({
  categorize: {},
  cloze: {},
  comprehension: {},

  setCategorizeData: (questionId, items) => {
    set((state) => ({
      categorize: {
        ...state.categorize,
        [questionId]: { items },
      },
    }));
  },

  setClozeData: (questionId, sentence) => {
    set((state) => ({
      cloze: {
        ...state.cloze,
        [questionId]: { sentence },
      },
    }));
  },

  setComprehensionData: (mcqId, selectedOption) => {
    set((state) => ({
      comprehension: {
        ...state.comprehension,
        [mcqId]: selectedOption, // Ensure selectedOption is correctly stored
      },
    }));
  },

  getPayload: () => {
    const { categorize, cloze, comprehension } = get();
    return { categorize, cloze, comprehension };
  },
}));
