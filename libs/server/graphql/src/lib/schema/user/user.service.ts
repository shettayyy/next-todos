import { handleGraphQLError } from '@task-master/shared/utils';
import passport from 'passport';
import { UserModel } from './user.model';
import { GraphQLError } from 'graphql';
import { ErrorCode } from '@task-master/shared/types';
import { User } from '../types.generated';
import { parse } from 'path';
import { getSignedUploadUrl } from '@task-master/server/config';

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser() as never);
passport.deserializeUser(UserModel.deserializeUser());

export const userAuthService = {
  createUser: async (user: Omit<User, 'id'>, password: string) => {
    try {
      const result = await UserModel.register(
        new UserModel({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
        password
      );

      if (!result || !result.id) {
        throw new GraphQLError('Failed to create user', {
          extensions: {
            code: ErrorCode.UserRegistrationFailed,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error, ErrorCode.UserRegistrationFailed);
    }
  },

  loginUser: async (email: string, password: string, req: Express.Request) => {
    // Passport Authenticate doesn't return a promise, so we wrap it in a promise
    return new Promise<User>((resolve, reject) => {
      // Authenticate helps to authenticate the user
      passport.authenticate(
        'local',
        (err: Error | null, user: User | PromiseLike<User>) => {
          // If there is an error, reject the promise
          if (err) {
            reject(err);
          }

          // If the user is not found, reject the promise
          if (!user) {
            reject(
              new Error(
                'We could not find a user with that email and password. Please try again.'
              )
            );
          }

          // Log the user in if the user is found and successfully authenticated
          req.logIn(user, (loginErr) => {
            // If there is an error logging in, reject the promise
            if (loginErr) {
              reject(loginErr);
            }

            // Resolve the promise with the user
            resolve(user);
          });
        }
      )({ body: { email, password } });
    });
  },

  logoutUser: async (req: Express.Request): Promise<User> => {
    const user = req.user as User;

    return new Promise((resolve, reject) => {
      req.logout((err: Error) => {
        if (err) {
          reject(err);
        }

        resolve(user);
      });
    });
  },
};

export const userService = {
  getUser: async (id: User['id']): Promise<User | null> => {
    try {
      const result = await UserModel.findById(id);

      if (!result) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: ErrorCode.UserNotFound,
          },
        });
      }

      return result;
    } catch (error) {
      return handleGraphQLError(error);
    }
  },

  generateUserProfileURL: async (filename: string) => {
    const { ext } = parse(filename);

    // Validate the file extension
    if (!ext || !['.jpg', '.jpeg', '.png'].includes(ext)) {
      throw new GraphQLError('Invalid file extension', {
        extensions: {
          code: ErrorCode.InvalidFileExtension,
        },
      });
    }

    const res = await getSignedUploadUrl(`user-profiles/${filename}`);

    if (!res) {
      throw new GraphQLError('Failed to generate signed URL', {
        extensions: {
          code: ErrorCode.FailedToGenerateSignedURL,
        },
      });
    }

    return res;
  },
};
