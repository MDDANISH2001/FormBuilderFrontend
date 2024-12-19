import { create } from "zustand";

interface QuestionData {
  quesDesc: string;
  points: string;
  categories: { id: string; name: string }[];
  items: { id: string; name: string; category: string }[];
  newCategoryName: string;
  newItemName: string;
}

interface ICategorizeStore {
  questions: Record<string, QuestionData>;
  addQuestion: (questionId: string) => void;
  removeQuestion: (questionId: string) => void;
  setQuestionData: (questionId: string, data: Partial<QuestionData>) => void;
}

const initialQuestionState: QuestionData = {
  quesDesc: "",
  points: "",
  categories: [],
  items: [],
  newCategoryName: "",
  newItemName: "",
};

export const useCategorizeStore = create<ICategorizeStore>((set, get) => ({
  questions: {},

  addQuestion: (questionId: string) =>
    set((state) => ({
      questions: {
        ...state.questions,
        [questionId]: { ...initialQuestionState },
      },
    })),

  removeQuestion: (questionId: string) => {
    const { [questionId]: _, ...rest } = get().questions;
    set({ questions: rest });
  },

  setQuestionData: (questionId: string, data: Partial<QuestionData>) => {
    const current = get().questions[questionId] || initialQuestionState;
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
