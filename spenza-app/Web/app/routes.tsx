import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { AddIncome } from "./pages/AddIncome";
import { AddExpense } from "./pages/AddExpense";
import { SetGoal } from "./pages/SetGoal";
import { Transactions } from "./pages/Transactions";
import { Settings } from "./pages/Settings";
import { HiddenTransactions } from "./pages/HiddenTransactions";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Features } from "./pages/Features";
import { Download } from "./pages/Download";
import { About } from "./pages/About";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,

  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/add-income",
    Component: AddIncome,
  },
  {
    path: "/add-expense",
    Component: AddExpense,
  },
  {
    path: "/set-goal",
    Component: SetGoal,
  },
  {
    path: "/transactions",
    Component: Transactions,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/hidden-transactions",
    Component: HiddenTransactions,
  },
  {
    path: "/features",
    Component: Features,
  },
  {
    path: "/download",
    Component: Download,
  },
  {
    path: "/about",
    Component: About,
  }

]);
