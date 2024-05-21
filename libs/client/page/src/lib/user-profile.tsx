import {
  CameraIcon,
  PencilSquareIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';
import { PageHeader } from '@task-master/client/component/layout';
import { useAuth, useToast } from '@task-master/client/context';
import {
  GENERATE_USER_PROFILE_PICTURE_URL,
  UPDATE_USER,
  UserItemFragment,
} from '@task-master/client/graphql';
import {
  Button,
  Input,
  UserAvatar,
} from '@task-master/shared/ui/component/core';
import { PageLayout } from '@task-master/shared/ui/component/layout';
import { useToggle } from '@task-master/shared/ui/hooks';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

interface UserProfileForm {
  firstName: UserItemFragment['firstName'];
  lastName: UserItemFragment['lastName'];
  email: UserItemFragment['email'];
  profilePictureURL: File | string;
}

export const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [isEdit, toggle] = useToggle();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    control,
  } = useForm<UserProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      profilePictureURL: user?.profilePictureURL || '',
    },
  });
  const [generateUrl] = useMutation(GENERATE_USER_PROFILE_PICTURE_URL);
  const [updateProfile] = useMutation(UPDATE_USER);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Validate the file type, size and empty file. If validation fails, send the message and status (true/false)
  const validateFile = (file: File) => {
    if (!file) {
      return {
        code: 'NO_FILE',
        message:
          'No file uploaded or multiple file selected! Please upload one image file.',
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        code: 'FILE_SIZE',
        message: 'File size is too large! Max file size is 5 MB.',
      };
    }

    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/jpg'
    ) {
      return {
        code: 'INVALID_FILE_TYPE',
        message: 'Invalid file type! Please upload a jpg/jpeg/png file.',
      };
    }

    return null;
  };

  const onDrop = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    if (fileRejections.length) {
      const { message } = fileRejections[0].errors[0];
      setError('profilePictureURL', { message });
    } else {
      clearErrors('profilePictureURL');
      setValue('profilePictureURL', acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
    },
    validator: validateFile,
  });

  const updateUserProfile = async (formData: Omit<UserItemFragment, 'id'>) => {
    return await updateProfile({
      variables: {
        input: {
          ...formData,
        },
      },
    });
  };

  const onSubmit = async (formData: UserProfileForm) => {
    setSubmitting(true);
    let updatedProfilePictureURL =
      typeof formData.profilePictureURL === 'string'
        ? formData.profilePictureURL
        : '';

    try {
      if (typeof formData.profilePictureURL !== 'string') {
        const fileExtension = (formData.profilePictureURL as File).name.split(
          '.'
        )[1];
        const filename = `${formData.firstName}.${fileExtension}`;

        const { data } = await generateUrl({
          variables: {
            filename,
          },
        });

        if (data?.generateUserProfilePictureURL) {
          await fetch(data.generateUserProfilePictureURL, {
            method: 'PUT',
            body: formData.profilePictureURL,
            headers: {
              'Content-Type': (formData.profilePictureURL as File).type,
            },
          });

          // Remove the unnecessary portion from s3 url after extension and save the updated url
          updatedProfilePictureURL =
            data.generateUserProfilePictureURL.split('?')[0];
        }
      }

      const { data } = await updateUserProfile({
        ...formData,
        profilePictureURL: updatedProfilePictureURL,
      });

      if (data?.updateUser) {
        setUser(data.updateUser);
      }

      showToast('success', 'Profile updated successfully', {
        toastId: 'update-user-profile-success',
      });

      toggle();
    } catch (error) {
      showToast(
        'error',
        (error as Error).message || 'An error occurred. Please try again.',
        {
          toastId: 'update-user-profile-error',
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onBack = () => {
    navigate('/');
  };

  const renderUserProfile = (user?: UserItemFragment) => {
    if (!user) {
      return null;
    }

    return (
      <div className="flex flex-1 flex-col justify-center items-center gap-4">
        <UserAvatar
          url={user.profilePictureURL ?? ''}
          firstName={user.firstName}
          lastName={user.lastName}
          width={6}
          height={6}
        />

        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-xl">
            {user.firstName} {user.lastName}
          </span>

          <span className="text-neutral-500">{user.email}</span>
        </div>

        {!isEdit ? (
          <Button onClick={toggle} className="flex items-center gap-2">
            <PencilSquareIcon className="w-5 h-5" />

            <span>Edit Profile</span>
          </Button>
        ) : null}
      </div>
    );
  };

  const renderEditUserProfile = () => {
    return (
      <form
        className="flex flex-1 flex-col m-auto justify-center w-72 md:w-96 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="profilePictureURL"
          control={control}
          render={({ field: { value }, formState: { errors } }) => (
            <>
              <div
                {...getRootProps({ className: 'dropzone' })}
                className="rounded-full flex items-center justify-center self-center relative cursor-pointer"
              >
                {/* Profile picture is a url */}
                {value && typeof value === 'string' && (
                  <div
                    className="rounded-full w-24 h-24 bg-neutral-200"
                    style={{
                      backgroundImage: `url(${value})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}

                {/* Profile picture is a file */}
                {value && typeof value !== 'string' && (
                  <div
                    style={{
                      backgroundImage: `url(${URL.createObjectURL(value)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    className="w-24 h-24 rounded-full"
                  />
                )}

                {/* No profile picture */}
                {!value && (
                  <UserCircleIcon className="w-24 h-24 text-neutral-400" />
                )}
                <input {...getInputProps()} name="avatar" />
                <div className="absolute rounded-full w-8 h-8 flex items-center justify-center bg-orange-400 bottom-0 right-0">
                  <CameraIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              {errors.profilePictureURL && (
                <p className="text-red-500 text-xs md:text-sm text-center">
                  {errors.profilePictureURL.message}
                </p>
              )}
            </>
          )}
        />

        <Input
          id="firstName"
          label="First Name"
          placeholder="Enter your first name..."
          {...register('firstName', {
            required: 'First Name is required',
            minLength: {
              value: 2,
              message: 'First Name should be at least 2 characters long',
            },
            maxLength: {
              value: 30,
              message: 'First Name should be at most 20 characters long',
            },
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
            minLength: {
              value: 2,
              message: 'Last Name should be at least 2 characters long',
            },
            maxLength: {
              value: 30,
              message: 'Last Name should be at most 100 characters long',
            },
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

        <div className="flex gap-2">
          <Button className="w-full" onClick={toggle}>
            Cancel
          </Button>

          <Button className="w-full" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <PageLayout className="space-y-8">
      <PageHeader title="User Profile 🧑‍💼" onBack={onBack} />

      {isEdit ? renderEditUserProfile() : renderUserProfile(user)}
    </PageLayout>
  );
};
