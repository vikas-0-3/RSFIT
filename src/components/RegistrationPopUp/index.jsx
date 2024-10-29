import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Tabs,
  Form,
  Input,
  Radio,
  message,
  Alert,
  Switch,
} from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { userRegistration } from "../../services";
import { IMAGE_DOWNLOAD_BASE_URL } from "../../../config/urls";

const { TabPane } = Tabs;

const RegistrationPopUp = ({ visible, handleCancel, qrImageFileName }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState("");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${IMAGE_DOWNLOAD_BASE_URL}${qrImageFileName}`,
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setQrCode(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  const validateTab = async (tab) => {
    try {
      await form.validateFields();
      return true;
    } catch (errorInfo) {
      message.error("Please fix validation errors before proceeding.");
      return false;
    }
  };

  const handleTabChange = async (key) => {
    const nextTab = Number(key);

    if (nextTab !== currentTab) {
      const isValid = await validateTab(currentTab);
      if (isValid) {
        setCurrentTab(nextTab);
      }
    }
  };

  const nextTab = async () => {
    const isValid = await validateTab(currentTab);
    if (isValid && currentTab === 1) {
      const values = await form.validateFields();
      userRegistration(
        values.email,
        values.password,
        values.name,
        values.phone,
        values.gender
      )
        .then((response) => {
          if (response.success) {
            setErrorMessage(null);
            message.success("Registration successful!");
            setRegistrationComplete(true);
            setCurrentTab(2);
          } else {
            setErrorMessage(
              response.error || "Registration failed! Please try again."
            );
          }
        })
        .catch((error) => {
          setErrorMessage(
            error.message || "An unexpected error occurred. Please try again."
          );
        });
    }
  };

  const prevTab = async () => {
    const isValid = await validateTab(currentTab);
    if (isValid && currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleSubmit = () => {
    if (registrationComplete) {
      handleCancel(); // Close the modal
      message.success("Please login using your credentials");
      navigate("/home/login/"); // Redirect to the user page
    } else {
      message.error("Please complete the registration process first.");
    }
  };

  const bankDetails = {
    accountNumber: "912010029237583",
    ifsc: "UTIB0000696",
    bank: "AXIS bank",
    accountHolder: "ROHIT SHARMA",
    branch: "Delhi, 110059",
  };

  return (
    <Modal
      title="Registration Form"
      open={visible}
      onCancel={handleCancel}
      footer={[
        currentTab > 1 && (
          <Button key="back" onClick={prevTab}>
            Previous
          </Button>
        ),
        currentTab < 2 && (
          <Button key="next" type="primary" onClick={nextTab}>
            Next
          </Button>
        ),
        currentTab === 2 && (
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        ),
      ]}
    >
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      <Tabs
        activeKey={String(currentTab)}
        onChange={handleTabChange}
        renderTabBar={() => null}
      >
        <TabPane tab="Tab 1" key="1">
          <Form
            form={form}
            layout="vertical"
            name="userDetails"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Radio.Group>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
                <Radio value="other">Other</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number!" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Please enter a valid phone number!",
                },
              ]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <div className="modal-img-container">
            <img src={qrCode} alt="Payment QR" className="modal-img" />
          </div>
          <div style={{ marginTop: "20px" }}>
            <Switch
              checkedChildren="For foreign client"
              unCheckedChildren="For foreign client"
              onChange={(checked) => setShowBankDetails(checked)}
            />
          </div>
          {showBankDetails && (
            <div style={{ marginTop: "20px" }}>
              <h3>Bank Details</h3>
              <p>
                <strong>Account Number:</strong> {bankDetails.accountNumber}
              </p>
              <p>
                <strong>IFSC Code:</strong> {bankDetails.ifsc}
              </p>
              <p>
                <strong>Bank:</strong> {bankDetails.bank}
              </p>
              <p>
                <strong>Account Holder:</strong> {bankDetails.accountHolder}
              </p>
              <p>
                <strong>Branch:</strong> {bankDetails.branch}
              </p>
            </div>
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default RegistrationPopUp;