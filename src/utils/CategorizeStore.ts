// import { create } from "zustand";

// interface ICategorizeStore {
//     quesDesc: string,
//     setQuesDesc: (quesDesc: string) => void;
//     points: string;
//     setPoints: (points: string) => void;
//     categories: any[],
//     setCategories: (categories: any[]) => void,
//     items: any[],
//     setItems: (items: any[]) => void,
//     newCategoryName: string,
//     setNewCategoryName: (newCategoryName: string) => void,
//     newItemName: string,
//     setNewItemName: (newItemName: string) => void,
// }

// const initialState = {
//     quesDesc: "",
//     points: "",
//     categories: [],
//     items: [],
//     newCategoryName: '',
//     newItemName: '',
// };

// export const useCategorizeStore = create<ICategorizeStore>((set, get) => ({
//   ...initialState,
//     setQuesDesc: (quesDesc: string) => set({ quesDesc: quesDesc }),
//     setPoints: (points: string) => set({ points: points }),
//     setCategories: (categories: any[]) => set({categories: categories}),
//     setItems: (items: any[]) => set({items: items}),
//     setNewCategoryName: (newCategoryName: string) => set({ newCategoryName: newCategoryName }),
//     setNewItemName: (newItemName: string) => set({newItemName: newItemName}),
// }));

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
