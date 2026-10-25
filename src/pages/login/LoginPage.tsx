import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginSchema, useLogin, type TLoginCredentials } from '@/features/auth';
import { demoCredentials } from '@/mocks';
import { getFieldErrors } from '@/shared/api';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldError,
  Input,
  Label,
  Spinner,
} from '@/shared/ui';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const { register, control, handleSubmit } = useForm<TLoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });
  const { errors: validationErrors, isSubmitting } = useFormState({ control });
  const serverErrors = getFieldErrors(login.error);
  const emailError = validationErrors.email?.message ?? serverErrors.email;
  const passwordError = validationErrors.password?.message ?? serverErrors.password;
  const genericError =
    login.error && !serverErrors.email && !serverErrors.password
      ? 'Unable to sign in. Please try again.'
      : '';
  const submit = handleSubmit(async ({ email, password }) => {
    login.reset();
    try {
      await login.mutateAsync({ email, password });
      toast.success('Welcome back');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  });

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12 sm:px-6">
      <Card className="animate-page-enter w-full max-w-md overflow-hidden border-white/80 shadow-[0_18px_60px_rgba(60,64,67,0.12)]">
        <div className="h-1.5 bg-linear-to-r from-blue-700 via-blue-500 to-sky-400" />
        <CardHeader className="px-8 pb-2 pt-8">
          <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md shadow-primary/20">
            S
          </div>
          <p className="text-sm font-semibold text-primary">SMART SENDER</p>
          <CardTitle className="pt-1 text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Manage your webhook endpoints from one place.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form className="mt-5 space-y-5" onSubmit={submit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                {...register('email', { onChange: () => login.error && login.reset() })}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
                placeholder="you@company.com"
              />
              {emailError && <FieldError id="email-error" message={emailError} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', { onChange: () => login.error && login.reset() })}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'password-error' : undefined}
                placeholder="Enter your password"
              />
              {passwordError && <FieldError id="password-error" message={passwordError} />}
            </div>
            {genericError && <FieldError className="validation-message" message={genericError} />}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span className="sr-only">Signing in</span>
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs leading-5 text-slate-600">
            <p className="mb-1 font-semibold text-slate-800">Demo account</p>
            <p>Email: {demoCredentials.email}</p>
            <p>Password: {demoCredentials.password}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
