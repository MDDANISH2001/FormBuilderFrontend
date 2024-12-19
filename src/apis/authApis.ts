import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./baseUrlApi";

interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function useUserRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiClient.post(`/createUser`, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
    },
  });
}

export function useUserLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiClient.post(`/login`, payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration"] });
    },
  });
}
