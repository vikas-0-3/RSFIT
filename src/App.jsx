import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import Errorpage from "./pages/Errorpage";
import Homepage from "./pages/Homepage";
import SuperPlanDetails from "./pages/SuperPlanDetails";
import "./App.css";
import Aboutpage from "./pages/Aboutpage";
import Contactpage from "./pages/Contactpage";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import LoginPage from "./pages/Dashboard/Login";
import DashboardLayout from "./pages/Dashboard/DasboardLayout";
import UserContextProvider from "./context/UserContext";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { getProgramsList } from "./services";
import { MEDIA_FOR_PROGRAMS, POPUP_DISCOUNT_PLAN_TITLE } from "./contants";

function App() {
  const [showDiscount, setShowDiscount] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [discountPlan, setDiscountPlan] = useState(null);

  useEffect(() => {
    getProgramsList().then((response) => {
      const fetchedPlanDetails = response?.data?.programs;
      fetchedPlanDetails.forEach((program) => {
        const newMedia = MEDIA_FOR_PROGRAMS[program.title];
        if (newMedia) {
          program.media = newMedia;
        }
      });
      const discontPlan = fetchedPlanDetails.find(
        (item) => item.title === POPUP_DISCOUNT_PLAN_TITLE
      );

      setPlanDetails(fetchedPlanDetails);
      setDiscountPlan(discontPlan);
    });
  }, []);

  // for handling discount pop up on homepage
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setShowDiscount(true);
    }, 3000);
    const interval = setInterval(() => {
      setShowDiscount(true);
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Render loading screen if planDetails is not available yet
  if (!planDetails) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Errorpage />,
      children: [
        {
          index: true,
          element: (
            <Homepage
              setShowDiscount={setShowDiscount}
              showDiscount={showDiscount}
              discountPlan={discountPlan}
            />
          ),
        },
        {
          path: "/home/plan/superplans/superbeginning",
          element: <SuperPlanDetails details={planDetails[0]} />,
        },
        {
          path: "/home/plan/superplans/supershred",
          element: <SuperPlanDetails details={planDetails[1]} />,
        },
        {
          path: "/home/plan/superplans/superbulk",
          element: <SuperPlanDetails details={planDetails[2]} />,
        },
        {
          path: "/home/plan/videoconsultation",
          element: <SuperPlanDetails details={planDetails[3]} />,
        },
        {
          path: "/home/plan/onlinept",
          element: <SuperPlanDetails details={planDetails[4]} />,
        },
        {
          path: "/home/plan/combo/beginning+shred",
          element: <SuperPlanDetails details={planDetails[5]} />,
        },
        {
          path: "/home/plan/combo/beginning+bulk",
          element: <SuperPlanDetails details={planDetails[6]} />,
        },
        {
          path: "/home/plan/90+day+online+transformation+program",
          element: <SuperPlanDetails details={planDetails[7]} />,
        },
        {
          path: "/home/login",
          element: <LoginPage />,
        },
      ],
    },
    {
      path: "/aboutus",
      element: <RootLayout />,
      errorElement: <Errorpage />,
      children: [
        {
          index: true,
          element: <Aboutpage />,
        },
      ],
    },
    {
      path: "/contactus",
      element: <RootLayout />,
      errorElement: <Errorpage />,
      children: [
        {
          index: true,
          element: <Contactpage />,
        },
      ],
    },
    {
      path: "/terms",
      element: <RootLayout />,
      errorElement: <Errorpage />,
      children: [
        {
          index: true,
          element: <Terms />,
        },
      ],
    },
    {
      path: "/refund-policy",
      element: <RootLayout />,
      errorElement: <Errorpage />,
      children: [
        {
          index: true,
          element: <Refund />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <DashboardLayout>
          <UserDashboard />
        </DashboardLayout>
      ),
    },
    {
      path: "/admin-dashboard",
      element: (
        <DashboardLayout>
          <AdminDashboard />
        </DashboardLayout>
      ),
    },
  ]);

  return (
    <>
      <UserContextProvider>
        <div className="appWrapper">
          <RouterProvider router={router} />
        </div>
      </UserContextProvider>
    </>
  );
}

export default App;
