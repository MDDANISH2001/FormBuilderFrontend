import { create } from "zustand";

interface ComprehensionMCQOption {
  id: string;
  text: string;
}

interface ComprehensionMCQ {
  id: string;
  question: string;
  options: ComprehensionMCQOption[];
  correctIndex: number | null;
}

interface ComprehensionData {
  passage: string;
  mcqs: ComprehensionMCQ[];
}

interface IComprehensionStore {
  questions: Record<string, ComprehensionData>;
  addQuestion: (questionId: string) => void;
  removeQuestion: (questionId: string) => void;
  setQuestionData: (
    questionId: string,
    data: Partial<ComprehensionData>
  ) => void;
}

const initialComprehensionState: ComprehensionData = {
  passage: "",
  mcqs: [],
};

export const useComprehensionStore = create<IComprehensionStore>(
  (set, get) => ({
    questions: {},

    addQuestion: (questionId: string) => {
      set((state) => ({
        questions: {
          ...state.questions,
          [questionId]: { ...initialComprehensionState },
        },
      }));
    },

    removeQuestion: (questionId: string) => {
      const { [questionId]: _, ...rest } = get().questions;
      set({ questions: rest });
    },

    setQuestionData: (questionId: string, data: Partial<ComprehensionData>) => {
      const current = get().questions[questionId] || initialComprehensionState;
      set({
        questions: {
          ...get().questions,
          [questionId]: { ...current, ...data },
        },
      });
    },
  })
);
