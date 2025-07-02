import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import {
  Profile,
  Home,
  Layout,
  Pricing,
  Contact,
  Login,
  LLayout,  Principle,
  LMClass,
  LABook,
  LBookHistory,
  LIBook,
  LRBook,
  LIR,
  LDashboard,
  NLayout,
  AddProduct,
  TotalProduct,
  NAllRecord,
  NAddRecord,
  TLayout,
  NDash,
  Attandance
  
} from "./pages/Export.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/Auth.jsx";
import { AuthRoute, LibrianRoute, PublicRoute,NurseRoute,TeacherRoute } from "./routes/ExportRoute";
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
                    path: "dashboard",
                    element:<LDashboard/>,
                  },
                  {
                    path: "profile",
                    element: <Profile />,
                  },
                  {
                    path: "principal",
                    element: <Principle />,
                  },
                  {
                    path: "manage-class",
                    element: <LMClass />,
                  },
                  {
                    path: "add-book",
                    element: <LABook />,
                  },
                  {
                    path: "all-books",
                    element: <LBookHistory />,
                  },
                  {
                    path: "issue-books",
                    element: <LIBook />,
                  },
                  {
                    path: "return",
                    element: <LRBook />,
                  },
                  {
                    path: "history",
                    element: <LIR />,

                  }
                ]
              },
            ],
          },
          {
            path: "/nurse",
            element: <NurseRoute />,
            children: [
              {
                element: <NLayout />,
                children: [{
                  path: "dashboard",
                  element: <NDash/>
                },
                {
                  path: "profile",
                  element: <Profile />,
                },
                {
                  path: "principal",
                  element: <Principle />,
                },
                {
                  path: "add-product",
                  element: <AddProduct />,
                },
                {
                  path: "total-product",
                  element: <TotalProduct />,
                },
                {
                  path: "all-record",
                  element: <NAllRecord />,
                },
                {
                  path: "add-record",
                  element: <NAddRecord />,
                }
                ]
              }
            ]
          },
          {
            path:"/teacher",
            element:<TeacherRoute/>,
            children:[
              {element:<TLayout/>,
              children:[
              {
              path:"dashboard",
              element:<h1>This is my dashboard</h1>
              },
              {
                path:"profile",
                element:<Profile/>
              },
              {
                path:"principal",
                element:<Principle/>
              },
              {
                path:"add-attandance",
                element:<Attandance/>
              }
              
             
            ]}

            ]
          }
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
