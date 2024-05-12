import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Navigation } from './navigation';
import { AuthProvider, ToastProvider } from '@task-master/client/context';

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ToastProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </ApolloProvider>
    </ToastProvider>
  </StrictMode>
);
