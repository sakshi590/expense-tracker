import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Guard from "./Guard";
import { lazy, Suspense } from "react";
import Loader from "./components/Shared/Loader";

// Default export वाले components
const Homepage = lazy(() => import("./components/Home"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const Dashboard = lazy(() => import("./components/Shared/dashboard"));
const Report = lazy(() => import("./components/Shared/Report"));
const Transactions = lazy(() => import("./components/Shared/Transaction")); // ✅ consistent

// Named export वाले components
const Signup = lazy(() =>
  import("./components/Home/Signup").then((module) => ({
    default: module.Signup,
  }))
);

const Userlayout = lazy(() =>
  import("./components/User/Userlayout").then((module) => ({
    default: module.Userlayout,
  }))
);

const ForgotPassword = lazy(() =>
  import("./components/Home/ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  }))
);

const Adminlayout = lazy(() =>
  import("./components/Admin/Adminlayout").then((module) => ({
    default: module.Adminlayout,
  }))
);

const Users = lazy(() =>
  import("./components/Shared/Users").then((module) => ({
    default: module.Users,
  }))
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* admin routes */}
          <Route
            path="/app/admin"
            element={
              <Guard endpoint="/api/user/session" role="admin">
                <Adminlayout />
              </Guard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<Report />} />
            <Route path="users" element={<Users />} />
          </Route>

          {/* user routes */}
          <Route
            path="/app/user"
            element={
              <Guard endpoint="/api/user/session" role="user">
                <Userlayout />
              </Guard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<Report />} />
            <Route path="transaction" element={<Transactions />} />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;