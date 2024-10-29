import { useState } from "react";
import LandingSection from "../components/LandingSection";
import NinetyTransformation from "../components/NinetyTransformation";
import Plans from "../components/Plans";
import Combos from "../components/Combos";
import CoachSection from "../components/CoachSection";
import Footer from "../components/Footer";
import Discount from "../components/Discount";
import Testimonials from "../components/Testimonials";
import RegistrationPopUp from "../components/RegistrationPopUp";
import "./Homepage.css";

const Homepage = ({ setShowDiscount, showDiscount, discountPlan }) => {
  const [visible, setVisible] = useState(false);
  const onCancel = () => {
    setVisible(false);
  };
  const onCheckDiscount = () => {
    setShowDiscount(false);
    setVisible(true);
  };

  return (
    <div className="homeWrap">
      {showDiscount && (
        <div className="dsBackdrop">
          <Discount
            setShowDiscount={setShowDiscount}
            onCheckDiscount={onCheckDiscount}
          />
        </div>
      )}
      <RegistrationPopUp
        visible={visible}
        handleCancel={onCancel}
        qrImageFileName={discountPlan?.qrCode}
      />
      <LandingSection />
      <div className="superPlans">
        <h2>CUSTOM PLAN</h2>
      </div>
      <NinetyTransformation />
      <Plans />
      <Combos />
      <CoachSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Homepage;
