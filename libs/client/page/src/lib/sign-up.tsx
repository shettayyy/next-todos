import { useAuth } from '@task-master/client/context';
import { CreateUserInput } from '@task-master/client/graphql';
import { Button, Input } from '@task-master/shared/ui/component/core';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type SignUpForm = CreateUserInput & {
  confirmPassword?: string;
};

export const SignUp = () => {
  const { onRegister, isSigningUp } = useAuth();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignUpForm) => {
    delete data.confirmPassword;

    onRegister(data);
  };

  return (
    <PageLayout className="items-center justify-center">
      <form
        className="flex flex-col w-72 md:w-96 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-4xl font-medium text-left mt-2">Sign Up</h1>

        <Input
          id="firstName"
          label="First Name"
          placeholder="Enter your first name..."
          {...register('firstName', {
            required: 'First Name is required',
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: 'First Name should contain only alphabets',
            },
          })}
          error={errors.firstName?.message}
          aria-invalid={!!errors.firstName}
        />

        <Input
          id="lastName"
          label="Last Name"
          placeholder="Enter your last name..."
          {...register('lastName', {
            required: 'Last Name is required',
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: 'Last Name should contain only alphabets',
            },
          })}
          error={errors.lastName?.message}
          aria-invalid={!!errors.lastName}
        />

        <Input
          id="email"
          label="Email"
          placeholder="Enter your email address..."
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Invalid email address',
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
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          })}
          error={errors.password?.message}
          aria-invalid={!!errors.password}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password..."
          {...register('confirmPassword', {
            required: 'Confirm Password is required',
            validate: (value) =>
              value === getValues().password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
          aria-invalid={!!errors.confirmPassword}
        />

        <Button type="submit">
          {isSigningUp ? 'Signing up...' : 'Sign Up'}
        </Button>
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
