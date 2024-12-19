import { create } from "zustand";

interface Word {
  id: string;
  text: string;
}

interface ClozeQuestionData {
  sentence: string;
  words: Word[];
}

interface IClozeStore {
  questions: Record<string, ClozeQuestionData>;
  addQuestion: (questionId: string) => void;
  removeQuestion: (questionId: string) => void;
  setQuestionData: (
    questionId: string,
    data: Partial<ClozeQuestionData>
  ) => void;
}

const initialClozeQuestionState: ClozeQuestionData = {
  sentence: "",
  words: [],
};

export const useClozeStore = create<IClozeStore>((set, get) => ({
  questions: {},

  addQuestion: (questionId: string) =>
    set((state) => ({
      questions: {
        ...state.questions,
        [questionId]: { ...initialClozeQuestionState },
      },
    })),

  removeQuestion: (questionId: string) => {
    const { [questionId]: _, ...rest } = get().questions;
    set({ questions: rest });
  },

  setQuestionData: (questionId: string, data: Partial<ClozeQuestionData>) => {
    const current = get().questions[questionId] || initialClozeQuestionState;
    set({
      questions: {
        ...get().questions,
        [questionId]: {
          ...current,
          ...data,
        },
      },
    });
  },
}));
