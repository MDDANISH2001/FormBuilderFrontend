import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./baseUrlApi";

interface SaveFormPayload {
  userId: string;
  title: string;
  headerImage?: string;
  categorize?: Record<string, any>;
  cloze?: Record<string, any>;
  comprehension?: Record<string, any>;
  formId?: string;
}

export function useSaveForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveFormPayload) =>
      apiClient.put("/forms/updateForm", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Form Saved"] });
    },
  });
}

interface SaveFormResponse {
  userId: string;
  questionId: string;
  categorize?: Record<string, any>;
  cloze?: Record<string, any>;
  comprehension?: Record<string, any>;
}

export function useSaveFormResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveFormResponse) =>
      apiClient
        .post("/responses/submitFormResponse", payload)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Form Saved"] });
    },
  });
}

interface FormMeta {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function useUserForms(userId: string) {
  return useQuery<{ form: FormMeta[] }>({
    queryKey: ["formsByUser", userId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/forms/getForm?userId=${userId}`);
      return data; // expect backend to return an array of forms for this user
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}
