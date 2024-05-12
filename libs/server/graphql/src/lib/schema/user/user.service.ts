import passport from 'passport';
import { UserModel } from './user.model';
import { GraphQLError } from 'graphql';
import { ErrorCode } from '@task-master/shared/types';
import { User } from '../types.generated';

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
        throw new Error('Failed to create user');
      }

      return result;
    } catch (error) {
      throw new GraphQLError((error as Error).message, {
        extensions: {
          code: ErrorCode.UserRegistrationFailed,
        },
      });
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
            reject(new Error('User not found'));
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
      return await UserModel.findById(id);
    } catch (error) {
      throw new GraphQLError((error as Error).message, {
        extensions: {
          code: ErrorCode.UserNotFound,
        },
      });
    }
  },
};