import { useMutation, useQuery } from '@tanstack/react-query'
import { login, logout } from '../api'
import { api, queryClient } from '@/shared/api'
import type { TLoginCredentials, TUser } from '../model/types'
import { useSessionStore } from '@/shared/store'

const userKey = ['user', 'me'] as const
export function useCurrentUser() {
  return useQuery({ queryKey: userKey, queryFn: async () => (await api.get<TUser>('/v1/me')).data })
}
export function useLogin() {
  const setSignedIn = useSessionStore(state => state.setSignedIn)
  return useMutation({
    mutationFn: ({ email, password }: TLoginCredentials) => login(email, password),
    onSuccess: user => {
      queryClient.setQueryData(userKey, user)
      setSignedIn(true)
    },
  })
}
export function useLogout() {
  const setSignedIn = useSessionStore(state => state.setSignedIn)
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
      setSignedIn(false)
    },
  })
}
