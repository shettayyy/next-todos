import { useLazyQuery, useMutation } from '@apollo/client';
import {
  CreateUserInput,
  GET_USER,
  LOGIN,
  LOGOUT,
  REGISTER,
  UserItemFragment,
} from '@task-master/client/graphql';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useToast } from './toast';

interface AuthProvideProps {
  isAuthenticated: boolean;
  isLoggingIn?: boolean;
  isLoggingOut?: boolean;
  isSigningUp?: boolean;
  isAppReady?: boolean;
  user?: UserItemFragment;
  setUser: React.Dispatch<React.SetStateAction<UserItemFragment | undefined>>;
  onLogin: (email: string, password: string) => void;
  onRegister: (user: CreateUserInput) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthProvideProps>({
  isAuthenticated: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isSigningUp: false,
  isAppReady: false,
  user: undefined,
  setUser: () => null,
  onLogin: () => null,
  onRegister: () => null,
  onLogout: () => null,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthProvideProps['user']>(undefined);
  const [isAppReady, setAppReady] = useState(false);
  const { showToast } = useToast();

  // Mutation to login
  const [login, { loading: isLoggingIn }] = useMutation(LOGIN);

  // Mutation to logout
  const [logout, { loading: isLoggingOut }] = useMutation(LOGOUT);

  // Mutation to register
  const [register, { loading: isSigningUp }] = useMutation(REGISTER);

  const [getUser] = useLazyQuery(GET_USER);

  /**
   * Allow user to login with email and password
   *
   * @param {string} email A valid email address
   * @param {string} password A valid password
   * @return {void}
   *
   * @example
   * import { useAuth } from '@task-master/client/context';
   *
   * const { onLogin } = useAuth();
   *
   * onLogin('john.doe@gmail.com', 'password');
   */
  const onLogin = (email: string, password: string) => {
    login({
      variables: { email, password },
      onCompleted: (data) => {
        if (data.login) {
          setUser(data.login);
        }
      },
      onError: (error) => {
        showToast('error', error.message, {
          toastId: 'login-error',
        });
      },
    });
  };

  /**
   * Allow user to logout
   *
   * @return {void}
   *
   * @example
   * import { useAuth } from '@task-master/client/context';
   *
   * const { onLogout } = useAuth();
   *
   * onLogout();
   */
  const onLogout = () => {
    logout({
      onCompleted: () => {
        setUser(undefined);
      },
      onError: (error) => {
        showToast('error', error.message, {
          toastId: 'logout-error',
        });
      },
    });
  };

  /**
   * Fetch user profile
   *
   * @return {void}
   */
  const fetchUser = useCallback(async () => {
    try {
      const result = await getUser();
      if (result?.data?.user) {
        setUser(result.data.user as UserItemFragment);
      }
    } catch (error) {
      showToast('error', (error as Error).message, {
        toastId: 'fetch-user-error',
      });
    } finally {
      setAppReady(true);
    }
  }, [getUser, showToast]);

  /**
   * Allow user to register
   *
   * @param {UserItemFragment} user A valid user object
   * @return {void}
   *
   * @example
   * import { useAuth } from '@task-master/client/context';
   *
   * const { onRegister } = useAuth();
   *
   * onRegister({
   *   email: 'john.doe@gmail.com',
   *   firstName: 'John',
   *   lastName: 'Doe',
   * });
   */
  const onRegister = (user: CreateUserInput) => {
    register({
      variables: { input: user },
      onCompleted: (data) => {
        if (data.createUser) {
          setUser(data.createUser);
        }
      },
      onError: (error) => {
        showToast('error', error.message, {
          toastId: 'register-error',
        });
      },
    });
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoggingIn,
        isLoggingOut,
        isSigningUp,
        isAppReady,
        setUser,
        onLogin,
        onLogout,
        onRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
