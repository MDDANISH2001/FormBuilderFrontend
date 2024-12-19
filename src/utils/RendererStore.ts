import { create } from "zustand";

interface Item {
  id: string;
  name: string;
  category: string;
}

interface CategorizeData {
  items: Item[];
}

interface ClozeData {
  sentence: string;
}

interface RendererStore {
  categorize: Record<string, CategorizeData>;
  cloze: Record<string, ClozeData>;
  comprehension: Record<string, string>;
  setCategorizeData: (questionId: string, items: Item[]) => void;
  setClozeData: (questionId: string, sentence: string) => void;
  setComprehensionData: (mcqId: string, selectedOption: string) => void;
  getPayload: () => {
    categorize: Record<string, CategorizeData>;
    cloze: Record<string, ClozeData>;
    comprehension: Record<string, string>;
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
        [mcqId]: selectedOption,
      },
    }));
  },

  getPayload: () => {
    const { categorize, cloze, comprehension } = get();
    return { categorize, cloze, comprehension };
  },
}));