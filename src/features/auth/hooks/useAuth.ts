import { useMutation, useQuery } from '@tanstack/react-query';
import { login, logout } from '../api';
import { api, queryClient } from '@/shared/api';
import type { TLoginCredentials, TUser } from '../model/types';
import { useSessionStore } from '@/shared/store';

const USER_KEY = ['user', 'me'] as const;
export const useCurrentUser = () =>
  useQuery({ queryKey: USER_KEY, queryFn: async () => (await api.get<TUser>('/v1/me')).data });

export const useLogin = () => {
  const setSessionExpired = useSessionStore(state => state.setSessionExpired);
  return useMutation({
    mutationFn: ({ email, password }: TLoginCredentials) => login(email, password),
    onSuccess: user => {
      queryClient.setQueryData(USER_KEY, user);
      setSessionExpired(false);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
    },
  });
};
