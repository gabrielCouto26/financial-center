import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { apiFetch } from '../../services/api';

const requestSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(8, 'At least 8 characters'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type RequestFormValues = z.infer<typeof requestSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
};

export function ForgotPasswordPage() {
  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    setValue,
    formState: { errors: resetErrors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: '',
      password: '',
      confirmPassword: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (values: RequestFormValues) =>
      apiFetch<ForgotPasswordResponse>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: (data) => {
      if (data.resetToken) {
        setValue('token', data.resetToken);
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (values: ResetFormValues) =>
      apiFetch<void>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: values.token,
          password: values.password,
        }),
      }),
  });

  const forgotPasswordResponse = forgotPasswordMutation.data;
  const canReset = Boolean(forgotPasswordResponse?.resetToken);
  const resetSucceeded = resetPasswordMutation.isSuccess;

  return (
    <section>
      <h1>Forgot password</h1>
      <p>Request a reset token and define a new password.</p>

      <form
        onSubmit={handleRequestSubmit((values) =>
          forgotPasswordMutation.mutate(values)
        )}
        className="form"
      >
        <label>
          Email
          <input type="email" autoComplete="email" {...registerRequest('email')} />
        </label>
        {requestErrors.email && (
          <p className="error">{requestErrors.email.message}</p>
        )}
        {forgotPasswordMutation.isError && (
          <p className="error">{forgotPasswordMutation.error.message}</p>
        )}
        {forgotPasswordResponse && (
          <p>{forgotPasswordResponse.message}</p>
        )}
        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending
            ? 'Requesting…'
            : 'Request reset token'}
        </button>
      </form>

      {canReset && !resetSucceeded && (
        <form
          onSubmit={handleResetSubmit((values) =>
            resetPasswordMutation.mutate(values)
          )}
          className="form"
        >
          <label>
            Reset token
            <input type="text" autoComplete="off" {...registerReset('token')} />
          </label>
          {resetErrors.token && (
            <p className="error">{resetErrors.token.message}</p>
          )}
          <label>
            New password
            <input
              type="password"
              autoComplete="new-password"
              {...registerReset('password')}
            />
          </label>
          {resetErrors.password && (
            <p className="error">{resetErrors.password.message}</p>
          )}
          <label>
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              {...registerReset('confirmPassword')}
            />
          </label>
          {resetErrors.confirmPassword && (
            <p className="error">{resetErrors.confirmPassword.message}</p>
          )}
          {resetPasswordMutation.isError && (
            <p className="error">{resetPasswordMutation.error.message}</p>
          )}
          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending
              ? 'Updating…'
              : 'Update password'}
          </button>
        </form>
      )}

      {resetSucceeded && (
        <p>Password updated. You can sign in with the new password now.</p>
      )}

      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </section>
  );
}
