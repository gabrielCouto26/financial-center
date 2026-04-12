import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { apiFetch, setStoredToken } from '../../services/api';
import type { SafeUser } from '../../types/user';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

type AuthResponse = {
  accessToken: string;
  user: SafeUser;
};

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: (data) => {
      setStoredToken(data.accessToken);
      void queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/dashboard', { replace: true });
    },
  });

  return (
    <section>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="form"
      >
        <label>
          Email
          <input type="email" autoComplete="email" {...register('email')} />
        </label>
        {errors.email && (
          <p className="error">{errors.email.message}</p>
        )}
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </label>
        {errors.password && (
          <p className="error">{errors.password.message}</p>
        )}
        {mutation.isError && (
          <p className="error">{mutation.error.message}</p>
        )}
        <p>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
