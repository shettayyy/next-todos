import { CreateUserInput } from '@task-master/client/graphql';
import { Button, Input } from '@task-master/shared/ui/component/core';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type SignUpForm = CreateUserInput & {
  confirmPassword: string;
};

export const SignUp = () => {
  const { register } = useForm<SignUpForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <PageLayout>
      <form className="flex flex-col w-72 md:w-96 space-y-4">
        <h1 className="text-4xl font-medium text-left mt-2">Sign Up</h1>

        <Input
          id="firstName"
          label="First Name"
          placeholder="Enter your first name..."
          {...register('firstName')}
        />

        <Input
          id="lastName"
          label="Last Name"
          placeholder="Enter your last name..."
          {...register('lastName')}
        />

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

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password..."
          {...register('confirmPassword')}
        />

        <Button type="submit">Sign Up</Button>
      </form>

      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-orange-400 hover:underline">
          Login
        </Link>
      </p>
    </PageLayout>
  );
};
