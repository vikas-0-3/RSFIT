import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  Space,
  Upload,
  message,
  Alert,
} from "antd";
import { Navigate } from "react-router-dom";
import { UploadOutlined, LogoutOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import "./index.css";
import { uploadVideo, userRegistration } from "../../services";
import { VIDEO_NAME_MAPPER, PHOTO_NAME_MAPPER } from "../../contants";

const { Option } = Select;
const { TextArea } = Input;

const UserDashboard = () => {
  const { userInfo, userRoleInfo, userLoggedInInfo, logout } =
    useContext(UserContext);
  const [user, setUser] = userInfo;
  const [userRole] = userRoleInfo;
  const [userLoggedIn] = userLoggedInInfo;

  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState({});
  const [uploadedPhotos, setUploadedPhotos] = useState({});

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
      age: user?.age || null,
      gender: user?.gender.toLowerCase(),
      height: user?.height || null,
      weight: user?.weight || null,
      contact: user?.phone || null,
      address: user?.address || null,
      profession: user?.profession || null,
      medicalHistory: user?.medicalHistory || null,
      dietPreferences: user?.nonVeg ? "nonveg" : "veg",
      smoking: user?.smoking ? "yes" : "no",
      drinking: user?.drinking ? "yes" : "no",
      foodAllergy: user?.foodAllergy || null,
      fitnessGoals: user?.goal || null,
      workoutTimings: user?.workoutTime || null,
      workoutPlace: user?.workoutPlace || null,
      experience: user?.workoutExperience || null,
      previousExperience: user?.previousExperience || null,
      supplements: user?.supplements || null,
      additionalInfo: user?.otherInfo || null,
    });
  }, [user, form]);

  const handleSubmit = async (values) => {
    try {
      const registrationResponse = await userRegistration(
        values?.email,
        user?.password,
        values?.name,
        values?.contact,
        values?.gender,
        values?.age,
        values?.height,
        values?.weight,
        values?.address,
        values?.profession,
        values?.medicalHistory,
        values?.dietPreferences === "nonveg",
        values?.smoking,
        values?.drinking,
        values?.foodAllergy,
        values?.fitnessGoals,
        values?.workoutTimings,
        values?.workoutPlace,
        values?.experience,
        values?.previousExperience,
        values?.supplements,
        values?.additionalInfo
      );

      if (registrationResponse.success) {
        const updatedUser = registrationResponse?.data?.user;
        setUser(updatedUser);
      } else {
        message.error("Failed to update user profile. Please try again.");
        return;
      }

      for (const [key, file] of Object.entries(uploadedVideos)) {
        if (file) {
          const originalExtension = file.name.split(".").pop();
          const newFileName = `${
            VIDEO_NAME_MAPPER[key] || key
          }.${originalExtension}`;
          const renamedFile = new File([file], newFileName, {
            type: file.type,
          });

          try {
            const uploadResponse = await uploadVideo(
              user._id,
              VIDEO_NAME_MAPPER[key],
              renamedFile,
              "video"
            );
            if (uploadResponse.success) {
              const updatedUser = uploadResponse?.data?.user;
              setUser(updatedUser);
            } else {
              message.warning(
                `Failed to upload video ${
                  VIDEO_NAME_MAPPER[key] || key
                }. Please try again later.`
              );
            }
          } catch (uploadError) {
            message.warning(
              `Error uploading video ${
                VIDEO_NAME_MAPPER[key] || key
              }. Please try again later.`
            );
          }
        }
      }

      for (const [key, file] of Object.entries(uploadedPhotos)) {
        if (file) {
          const originalExtension = file.name.split(".").pop();
          const newFileName = `${
            PHOTO_NAME_MAPPER[key] || key
          }.${originalExtension}`;
          const renamedFile = new File([file], newFileName, {
            type: file.type,
          });
          try {
            const uploadResponse = await uploadVideo(
              user._id,
              PHOTO_NAME_MAPPER[key],
              renamedFile,
              "image"
            );
            if (uploadResponse.success) {
              const updatedUser = uploadResponse?.data?.user;
              setUser(updatedUser);
            } else {
              message.warning(
                `Failed to upload photo ${
                  PHOTO_NAME_MAPPER[key] || key
                }. Please try again later.`
              );
            }
          } catch (uploadError) {
            message.warning(
              `Error uploading photo ${
                PHOTO_NAME_MAPPER[key] || key
              }. Please try again later.`
            );
          }
        }
      }

      setIsEdit(!isEdit);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error("Failed to update profile. Please try again.");
    }
  };

  const handleFileUpload = (file, fileList, fieldName) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (isVideo) {
      if (!isVideo) {
        message.error(`${file.name} is not a video file.`);
        return Upload.LIST_IGNORE;
      }
      setUploadedVideos((prev) => ({ ...prev, [fieldName]: file }));
    } else if (isImage) {
      if (!isImage) {
        message.error(`${file.name} is not an image file.`);
        return Upload.LIST_IGNORE;
      }
      setUploadedPhotos((prev) => ({ ...prev, [fieldName]: file }));
    }
    return false;
  };

  const toggleEditMode = () => {
    setIsEdit(!isEdit);
  };

  const handleLogout = () => {
    message.success("Logged out successfully");
    logout();
  };

  if (!userLoggedIn) {
    return <Navigate to="/home/login" replace />;
  }

  if (userRole !== "user") {
    return (
      <Alert
        message="Access Denied"
        description="You do not have permission to access the user dashboard."
        type="error"
        showIcon
      />
    );
  }

  if (!user) {
    return (
      <Alert
        message="Error"
        description="User information not available. Please try logging in again."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="user-dashboard-container">
      <div className="header">
        <h2>
          Welcome {user?.name || "User"}, click on the edit button to update
          your details
        </h2>
        {isEdit ? (
          <>
            <Button
              htmlType="submit"
              form="userForm"
              style={{ marginRight: "2px" }}
            >
              Submit
            </Button>
            <Button onClick={toggleEditMode} style={{ marginRight: "2px" }}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={toggleEditMode} style={{ marginRight: "2px" }}>
            Edit Profile
          </Button>
        )}
        {!isEdit && (
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="form-container"
        id="userForm"
      >
        {/* Personal Information Section */}
        <div>
          <div className="section-title">Personal Information</div>
          <Space />
          <Form.Item label="Name" name="name">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please enter your age" }]}
          >
            <Input
              type="number"
              placeholder="Enter your age"
              disabled={!isEdit}
            />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="others">Others</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Height" name="height">
            <Input placeholder="Enter your height in cm" disabled={!isEdit} />
          </Form.Item>

          <Form.Item label="Weight" name="weight">
            <Input placeholder="Enter your weight in kg" disabled={!isEdit} />
          </Form.Item>
          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[
              { required: true, message: "Please enter your contact number" },
            ]}
          >
            <Input placeholder="Enter your contact number" disabled={!isEdit} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input placeholder="Enter your address" disabled={!isEdit} />
          </Form.Item>
        </div>

        {/* Lifestyle and Preferences */}
        <div>
          <div className="section-title">Lifestyle & Preferences</div>
          <Space />
          <Form.Item label="Profession" name="profession">
            <Input placeholder="Enter your profession" disabled={!isEdit} />
          </Form.Item>

          <Form.Item label="Physical/Medical History" name="medicalHistory">
            <TextArea
              rows={4}
              placeholder="Mention any medical conditions or medications"
              disabled={!isEdit}
            />
          </Form.Item>

          <Form.Item label="Diet Preferences" name="dietPreferences">
            <Select placeholder="Select your diet" disabled={!isEdit}>
              <Option value="veg">Veg</Option>
              <Option value="nonveg">Non-Veg</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Smoking History"
            name="smoking"
            rules={[{ required: true, message: "Please select Yes or No" }]}
          >
            <Select placeholder="Select Yes or No" disabled={!isEdit}>
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Drinking History"
            name="drinking"
            rules={[{ required: true, message: "Please select Yes or No" }]}
          >
            <Select placeholder="Select Yes or No" disabled={!isEdit}>
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Food Allergy" name="foodAllergy">
            <Input
              placeholder="Mention any food allergies"
              disabled={!isEdit}
            />
          </Form.Item>
        </div>

        {/* Fitness Section */}
        <div>
          <div className="section-title">Fitness Information</div>
          <Space />
          <Form.Item label="Fitness Goals" name="fitnessGoals">
            <TextArea
              rows={4}
              placeholder="What are your fitness goals?"
              disabled={!isEdit}
            />
          </Form.Item>

          <Form.Item label="Workout Timings" name="workoutTimings">
            <Select placeholder="Select your workout timing" disabled={!isEdit}>
              <Option value="morning">Morning</Option>
              <Option value="evening">Evening</Option>
              <Option value="flexible">Flexible</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Workout Place" name="workoutPlace">
            <Select placeholder="Select your workout place" disabled={!isEdit}>
              <Option value="gym">Gym</Option>
              <Option value="home">Home</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Current Workout" name="experience">
            <TextArea
              rows={4}
              placeholder="Describe your current workout routine"
              disabled={!isEdit}
            />
          </Form.Item>

          <Form.Item
            label="Previous Gym/Workout Experience"
            name="previousExperience"
          >
            <TextArea
              rows={4}
              placeholder="Describe your previous workout experience"
              disabled={!isEdit}
            />
          </Form.Item>

          <Form.Item label="Supplements" name="supplements">
            <Input
              placeholder="Mention any supplements you are taking"
              disabled={!isEdit}
            />
          </Form.Item>

          {/* Additional Information */}
          <Form.Item label="Additional Information" name="additionalInfo">
            <TextArea
              rows={4}
              placeholder="Anything else you want to share?"
              disabled={!isEdit}
            />
          </Form.Item>
        </div>

        {/* File upload section */}
        <div className="final-assessment-section">
          <div className="section-title">Fitness Assessment</div>
          <Space />
          {/* Free Squats */}
          <Form.Item
            label="Free Squats"
            name="freeSquatsVideo"
            className="video-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "freeSquats")
              }
              maxCount={1}
              accept="video/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Video
              </Button>
            </Upload>
          </Form.Item>
          {/* Push ups or Knee Push ups */}
          <Form.Item
            label="Push Ups or Knee Push Ups"
            name="pushUpsVideo"
            className="video-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "pushUps")
              }
              maxCount={1}
              accept="video/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Video
              </Button>
            </Upload>
          </Form.Item>
          {/* Bar Dips */}
          <Form.Item
            label="Bar Dips (If you can perform)"
            name="barDipsVideo"
            className="video-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "barDips")
              }
              maxCount={1}
              accept="video/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Video
              </Button>
            </Upload>
          </Form.Item>
          {/* Jumping Jacks */}
          <Form.Item
            label="Jumping Jacks"
            name="jumpingJacksVideo"
            className="video-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "jumpingJacks")
              }
              maxCount={1}
              accept="video/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Video
              </Button>
            </Upload>
          </Form.Item>
          {/* High Knee Jump */}
          <Form.Item
            label="High Knee Jump"
            name="highKneeJumpVideo"
            className="video-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "highKneeJump")
              }
              maxCount={1}
              accept="video/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Video
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Front Pose Photo"
            name="frontPosePhoto"
            className="photo-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "frontPose")
              }
              maxCount={1}
              accept="image/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Photo
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Back Pose Photo"
            name="backPosePhoto"
            className="photo-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "backPose")
              }
              maxCount={1}
              accept="image/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Photo
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Side Pose Photo"
            name="sidePosePhoto"
            className="photo-upload-section"
          >
            <Upload
              beforeUpload={(file, fileList) =>
                handleFileUpload(file, fileList, "sidePose")
              }
              maxCount={1}
              accept="image/*"
              disabled={!isEdit}
            >
              <Button icon={<UploadOutlined />} disabled={!isEdit}>
                Upload Photo
              </Button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default UserDashboard;
