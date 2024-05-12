import { useMutation } from '@apollo/client';
import {
  CreateUserInput,
  LOGIN,
  LOGOUT,
  REGISTER,
  UserItemFragment,
} from '@task-master/client/graphql';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { useToast } from './toast';

interface AuthProvideProps {
  isAuthenticated: boolean;
  user?: UserItemFragment;
  setUser: React.Dispatch<React.SetStateAction<UserItemFragment | undefined>>;
  onLogin: (email: string, password: string) => void;
  onRegister: (user: CreateUserInput) => void;
  onLogout: () => void;
}

const AuthContext = createContext<AuthProvideProps>({
  isAuthenticated: false,
  user: undefined,
  setUser: () => null,
  onLogin: () => null,
  onRegister: () => null,
  onLogout: () => null,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthProvideProps['user']>(undefined);
  const { showToast } = useToast();

  // Mutation to login
  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      if (data.login) {
        setUser(data.login);
      }
    },
    onError: (error) => {
      showToast('error', error.message);
    },
  });

  // Mutation to logout
  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      setUser(undefined);
    },
    onError: (error) => {
      showToast('error', error.message);
    },
  });

  // Mutation to register
  const [register] = useMutation(REGISTER, {
    onCompleted: (data) => {
      if (data.createUser) {
        setUser(data.createUser);
      }
    },
    onError: (error) => {
      showToast('error', error.message);
    },
  });

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
    login({ variables: { email, password } });
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
    logout();
  };

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
   *   email: '
   *  firstName: 'John',
   * lastName: 'Doe',
   * });
   */
  const onRegister = (user: CreateUserInput) => {
    register({ variables: { input: user } });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
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
