import { Button, Input } from '@task-master/shared/ui/component/core';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '@task-master/client/context';
import { LoginMutationVariables } from '@task-master/client/graphql';

export function Login() {
  const { onLogin, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginMutationVariables>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = ({ email, password }: LoginMutationVariables) => {
    onLogin(email, password);
  };

  return (
    <PageLayout>
      <form
        className="flex flex-col w-72 md:w-96 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-4xl font-medium text-left mt-2">Login</h1>

        <Input
          id="email"
          label="Email"
          placeholder="Enter your email address..."
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match an email format',
            },
          })}
          error={errors.email?.message}
          aria-invalid={!!errors.email}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password..."
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password?.message}
          aria-invalid={!!errors.password}
        />

        <Button type="submit">{isLoggingIn ? 'Logging in...' : 'Login'}</Button>
      </form>

      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/register" className="text-orange-400 hover:underline">
          Sign up
        </Link>
      </p>
    </PageLayout>
  );
}

export default Login;
