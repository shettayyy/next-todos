import { Input } from '@task-master/shared/ui/component/core';
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
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 sm:px-2">
      <form className="flex flex-col w-72 space-y-4">
        <h1 className="text-4xl font-medium text-left mt-2">Login</h1>

        <Input
          id="email"
          label="Email"
          placeholder="Enter your email address..."
          {...register('email')}
        />

        <Input
          id="email"
          label="Password"
          type="password"
          placeholder="Enter your password..."
          {...register('password')}
        />

        <button
          type="submit"
          className="bg-slate-100 text-black rounded-md p-2 mt-4"
        >
          Login
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/register" className="text-orange-400 hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}

export default Login;
