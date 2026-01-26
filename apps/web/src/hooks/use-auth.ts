import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '@/services';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { showToast } from './use-toast';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken, data.expiresIn);
      showToast.success('Welcome back!', `Logged in as ${data.user.firstName}`);

      // Redirect based on role
      if (data.user.role === 'PROFESSOR') {
        router.push('/professor/dashboard');
      } else if (data.user.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      showToast.error('Login failed', error.message || 'Invalid email or password');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken, data.expiresIn);
      showToast.success('Account created!', `Welcome to AutoGrader, ${data.user.firstName}`);

      // Redirect based on role
      if (data.user.role === 'PROFESSOR') {
        router.push('/professor/dashboard');
      } else if (data.user.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      showToast.error('Registration failed', error.message || 'Could not create account');
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated && !user,
    staleTime: Infinity,
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    showToast.info('Logged out', 'You have been signed out successfully');
    router.push('/login');
  };
}

export function useRefreshToken() {
  const { refreshToken, setAccessToken, logout } = useAuthStore();

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      return authService.refreshToken(refreshToken);
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken, data.expiresIn);
    },
    onError: () => {
      logout();
      showToast.warning('Session expired', 'Please log in again');
    },
  });
}
