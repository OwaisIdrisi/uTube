import Layout from "./Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import VideoPage from "./pages/VideoPage";
import Subscriptions from "./pages/Subscription";
import Tweets from "./pages/Tweets";
import ChannelPage from "./pages/ChannelPage";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./api/auth";
import { setUserAndToken } from "./features/authSlice";
import LikedPage from "./pages/LikedPage";
import Tweet from "./pages/Tweet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },

      {
        path: "/tweets",
        element: (
          <ProtectedRoute>
            <Tweets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/video/:id",
        element: (
          <ProtectedRoute>
            <VideoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/subscriptions",
        element: (
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/channel/:username",
        element: (
          <ProtectedRoute>
            <ChannelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/liked",
        element: (
          <ProtectedRoute>
            <LikedPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tweet/:id",
        element: (
          <ProtectedRoute>
            <Tweet />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token") || null;
  const user = useSelector((state) => state.auth.user);
  const hasFetchedUser = useRef(false);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log(currentUser);
        dispatch(
          setUserAndToken({ user: currentUser.user, token: currentUser.token })
        );
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    if (!token && !user && !hasFetchedUser.current) {
      loadUser();
      hasFetchedUser.current = true;
    }
  }, [token, user, dispatch]);
  return <RouterProvider router={router} />;
}

export default App;
