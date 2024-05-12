import { Button, Input } from '@task-master/shared/ui/component/core';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export function Login() {
  const { register } = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <PageLayout>
      <form className="flex flex-col w-72 space-y-4">
        <h1 className="text-4xl font-medium text-left mt-2">Login</h1>

        <Input
          id="email"
          label="Email"
          placeholder="Enter your email address..."
          {...register('email')}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password..."
          {...register('password')}
        />

        <Button type="submit">Login</Button>
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
