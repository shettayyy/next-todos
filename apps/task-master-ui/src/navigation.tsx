import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(<Route path="/" element={<div>Home</div>} />)
);

export const Navigation = () => {
  return <RouterProvider router={router} />;
};
