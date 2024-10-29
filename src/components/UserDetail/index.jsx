import React, { useState } from "react";
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Row,
  Col,
  Layout,
  Space,
  Drawer,
  message,
  Switch,
  Grid,
} from "antd";
import { LeftOutlined, DownloadOutlined } from "@ant-design/icons";
import FitnessProgramForm from "../CreatePDF/index.jsx";
import { PHOTO_NAME_MAPPER, VIDEO_NAME_MAPPER } from "../../contants.js";
import { downloadVideo, updateUserStatus } from "../../services.js";
import DietPlanForm from "../CreateDietPlan/index.jsx";

const { Title } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const UserDetailPage = ({
  user,
  onBack,
  setUsersList,
  usersList,
  setFilteredData,
}) => {
  const [isWorkoutDrawerVisible, setIsWorkoutDrawerVisible] = useState(false);
  const [isDietDrawerVisible, setIsDietDrawerVisible] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [isActive, setIsActive] = useState(user.active);
  const screens = useBreakpoint();

  console.log("user", user)

  const handleDownload = (exercise, type) => {
    setDownloading((prev) => ({ ...prev, [exercise]: true }));
    downloadVideo(exercise, user, type)
      .then((response) => {
        if (response.success) {
          message.success(`Successfully downloaded ${exercise} video`);
        } else {
          message.error(
            `Failed to download ${exercise} video: ${
              response.message || "Unknown error"
            }`
          );
        }
      })
      .catch((error) => {
        message.error(
          `Error downloading ${exercise} video: ${
            error.message || "Unknown error"
          }`
        );
      })
      .finally(() => {
        setDownloading((prev) => ({ ...prev, [exercise]: false }));
      });
  };

  const showWorkoutDrawer = () => {
    setIsWorkoutDrawerVisible(true);
  };

  const closeWorkoutDrawer = () => {
    setIsWorkoutDrawerVisible(false);
  };

  const showDietDrawer = () => {
    setIsDietDrawerVisible(true);
  };

  const closeDietDrawer = () => {
    setIsDietDrawerVisible(false);
  };

  const handleStatusChange = (checked) => {
    updateUserStatus(user._id, checked)
      .then((response) => {
        if (response.success) {
          setIsActive(checked);
          const updatedUsersList = usersList.map((currUser) =>
            currUser._id === user._id ? { ...currUser, active: checked } : currUser
          );
          setUsersList(updatedUsersList);
          setFilteredData(updatedUsersList);
          message.success(
            `User status updated to ${checked ? "active" : "inactive"}`
          );
        } else {
          message.error(
            `Failed to update user status: ${
              response.message || "Unknown error"
            }`
          );
        }
      })
      .catch((error) => {
        message.error(
          `Error updating user status: ${error.message || "Unknown error"}`
        );
      });
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <Content style={{ padding: screens.xs ? "10px" : "20px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Button icon={<LeftOutlined />} onClick={onBack}>
            Back to Dashboard
          </Button>

          <div
            style={{
              display: "flex",
              flexDirection: screens.sm ? "row" : "column",
              justifyContent: "space-between",
              alignItems: screens.sm ? "center" : "flex-start",
              gap: "16px",
            }}
          >
            <Title level={screens.sm ? 2 : 3}>{user.name}'s Profile</Title>
            <Space direction={screens.sm ? "horizontal" : "vertical"} align={screens.sm ? "center" : "start"}>
              <span>Status: </span>
              <Switch
                checked={isActive}
                onChange={handleStatusChange}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
              <Button onClick={showWorkoutDrawer}>Create Workout PDF</Button>
              <Button onClick={showDietDrawer}>Create Diet PDF</Button>
            </Space>
          </div>

          <Drawer
            title="Create Fitness Program PDF"
            placement={screens.sm ? "right" : "bottom"}
            onClose={closeWorkoutDrawer}
            visible={isWorkoutDrawerVisible}
            width={screens.sm ? 720 : "100%"}
            height={screens.sm ? "100%" : "80%"}
          >
            <FitnessProgramForm onCancel={closeWorkoutDrawer}  id={user._id}/>
          </Drawer>

          <Drawer
            title="Create Diet Plan PDF"
            placement={screens.sm ? "right" : "bottom"}
            onClose={closeDietDrawer}
            visible={isDietDrawerVisible}
            width={screens.sm ? 720 : "100%"}
            height={screens.sm ? "100%" : "80%"}
          >
            {console.log(user._id)}
            <DietPlanForm onCancel={closeDietDrawer} id={user._id}/>
          </Drawer>

          <Card title="Personal Information">
            <Descriptions
              bordered
              column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
              size={screens.sm ? "middle" : "small"}
              layout={screens.sm ? "horizontal" : "vertical"}
            >
              <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
              <Descriptions.Item label="Age">{user.age}</Descriptions.Item>
              <Descriptions.Item label="Gender">
                {user.gender || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Weight">
                {user.weight}
              </Descriptions.Item>
              <Descriptions.Item label="Height">
                {user.height}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Number">
                {user.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>
                {user.address || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Lifestyle & Preferences">
            <Descriptions
              bordered
              column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
              size={screens.sm ? "middle" : "small"}
              layout={screens.sm ? "horizontal" : "vertical"}
            >
              <Descriptions.Item label="Profession">
                {user.profession || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Physical & Medical History">
                {user.medicalHistory || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Diet Preference">
                {user.dietRoutine || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Smoking History">
                {user.smoking == true ? "Yes" : "No" || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Drinking History">
                {user.drinking == true ? "Yes" : "No" || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Food Allergy">
                {user.foodAllergy || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Fitness Information">
            <Descriptions
              bordered
              column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
              size={screens.sm ? "middle" : "small"}
              layout={screens.sm ? "horizontal" : "vertical"}
            >
              <Descriptions.Item label="Fitness Goal">
                {user.goal || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Workout Timings">
                {user.workoutTime || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Workout Place">
                {user.workoutPlace || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Current Workout">
                {user.workoutExperience || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Previous Gym/Workout Experience">
                {user.previousExperience || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Supplements">
                {user.supplements || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Additional Information">
                {user.otherInfo || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Fitness Assessment Videos">
            <Row gutter={[16, 16]}>
              {Object.values(VIDEO_NAME_MAPPER).map((exercise) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={8}
                  xxl={6}
                  key={exercise}
                >
                  <Card title={exercise} size={screens.sm ? "default" : "small"}>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(exercise, 'video')}
                      loading={downloading[exercise]}
                      disabled={downloading[exercise]}
                      size={screens.sm ? "middle" : "small"}
                    >
                      {downloading[exercise] ? "Downloading..." : "Download"}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
          <Card title="Fitness Assessment Images">
            <Row gutter={[16, 16]}>
              {Object.values(PHOTO_NAME_MAPPER).map((image) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={8}
                  xxl={6}
                  key={image}
                >
                  <Card title={image} size={screens.sm ? "default" : "small"}>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(image, 'photo')}
                      loading={downloading[image]}
                      disabled={downloading[image]}
                      size={screens.sm ? "middle" : "small"}
                    >
                      {downloading[image] ? "Downloading..." : "Download"}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default UserDetailPage;