import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import {
  Lprofile,
  Home,
  Layout,
  Pricing,
  Contact,
  Login,
  LLayout,
  LNotify,
  LPrinciple,
  LMClass
} from "./pages/Export.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/Auth.jsx";
import { AuthRoute, LibrianRoute, PublicRoute } from "./routes/ExportRoute";
const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      // Public Routes
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/",
            element: <Layout />,
            children: [
              {
                index: true,
                element: <Home />,
              },
              {
                path: "pricing",
                element: <Pricing />,
              },
              {
                path: "contact",
                element: <Contact />,
              },
            ],
          },
          {
            path: "/login",
            element: <Login />,
          },
        ],
      },

      {
        element: <AuthRoute />,
        children: [
          {
            path: "/librarian",
            element: <LibrianRoute />,
            children: [
              {
                
                element: <LLayout />,
                children: [
                  {
                    index: true,
                    element: <h1>Welcome to Librarian Dashboard</h1>,
                  },
                  {
                    path: "profile",
                    element: <Lprofile />,
                  },
                  {
                    path: "notify",
                    element: <LNotify />,
                  },
                  {
                    path: "principal",
                    element: <LPrinciple />,
                  },
                  {
                    path: "manage-class",
                    element: <LMClass />,
                  },
                ]
              },
            ],
          },
        ],
      },
    ],
  },
]);

const App = () => {
  const query = new QueryClient()
  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

            <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>
  );
};

export default App;
