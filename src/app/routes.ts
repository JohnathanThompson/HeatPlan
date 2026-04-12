import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Schedule } from "./pages/Schedule";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/schedule",
    Component: Schedule,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);