import { useMutation, useQuery } from '@tanstack/react-query';
import { login, logout } from '../api';
import { api, queryClient } from '@/shared/api';
import type { TLoginCredentials, TUser } from '../model/types';
import { useSessionStore } from '@/shared/store';

const userKey = ['user', 'me'] as const;
export const useCurrentUser = () =>
  useQuery({ queryKey: userKey, queryFn: async () => (await api.get<TUser>('/v1/me')).data });

export const useLogin = () => {
  const setSignedIn = useSessionStore(state => state.setSignedIn);
  return useMutation({
    mutationFn: ({ email, password }: TLoginCredentials) => login(email, password),
    onSuccess: user => {
      queryClient.setQueryData(userKey, user);
      setSignedIn(true);
    },
  });
};

export const useLogout = () => {
  const setSignedIn = useSessionStore(state => state.setSignedIn);
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      setSignedIn(false);
    },
  });
};
