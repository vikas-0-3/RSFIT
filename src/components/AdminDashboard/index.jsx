import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Alert,
  Spin,
  Modal,
  Button,
  Form,
  List,
  Popover,
  Switch,
  message,
  Layout,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import UserDetailPage from "../UserDetail";
import "./index.css";
import { UserContext } from "../../context/UserContext";
import {
  getUsersList,
  addExercise,
  deleteExercise,
  getAllExercises,
  updateUserStatus,
  getStatistics
} from "../../services";

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Header, Content } = Layout;

const AdminDashboard = () => {
  const { userInfo, userRoleInfo, userLoggedInInfo, logout } =
    useContext(UserContext);
  const [user] = userInfo;
  const [userRole] = userRoleInfo;
  const [userLoggedIn] = userLoggedInInfo;

  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [stats, setStats] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersList();
        setUsersList(response.data.users);
        setFilteredData(response.data.users);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        setLoading(false);
      }
    };

    const fetchExercises = async () => {
      try {
        const response = await getAllExercises();
        setExercises(response.data.exercises);
      } catch (err) {
        setError("Failed to fetch exercises. Please try again later.");
      }
    };

    const fetchStatistics = async () => {
      try{
        const response = await getStatistics();
        setStats(response?.data?.stats)
      } catch (err){
        console.log("Failed to fetch stats");
        setStats({});
      }
    }

    fetchUsers();
    fetchExercises();
    fetchStatistics();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => handleNameClick(record)}>{text}</a>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "Contact Number",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "status",
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleStatusChange(checked, record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  const handleLogout = () => {
    message.success("Logged out successfully");
    logout();
    navigate("/home/login");
  };

  const handleStatusChange = async (checked, record) => {
    try {
      await updateUserStatus(record._id, checked);
        const updatedUsersList = usersList.map((user) =>
          user._id === record._id ? { ...user, active: checked } : user
        );
        setUsersList(updatedUsersList);
        setFilteredData(updatedUsersList);
      message.success(
        `User ${record.name}'s status updated to ${
          checked ? "active" : "inactive"
        }`
      );
    } catch (err) {
      message.error("Failed to update user status. Please try again.");
    }
  };

  const handleSearch = useCallback(
    (value) => {
      setSearchText(value);
      const filtered = usersList.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    },
    [usersList]
  );

  const handleNameClick = (record) => {
    setSelectedUser(record);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddExercise = async (values) => {
    try {
      await addExercise(values.name, values.link);
      const response = await getAllExercises();
      setExercises(response.data.exercises);
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.log("err", err);
      setError("Failed to add exercise. Please try again.");
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      const response = await getAllExercises();
      setExercises(response.data.exercises);
    } catch (err) {
      setError("Failed to delete exercise. Please try again.");
    }
  };

  const handlePopoverVisibleChange = (visible) => {
    setPopoverVisible(visible);
  };

  const exerciseManagementContent = (
    <div style={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        Add New Exercise
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={exercises}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteExercise(item._id)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  VideoLink
                </a>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  // Access control logic
  if (!userLoggedIn) {
    return <Navigate to="/home/login" replace />;
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

  if (userRole !== "admin") {
    return (
      <Alert
        message="Access Denied"
        description="You do not have permission to access the admin dashboard."
        type="error"
        showIcon
      />
    );
  }

  if (selectedUser) {
    return (
      <UserDetailPage
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        usersList={usersList}
        setUsersList={setUsersList}
        setFilteredData={setFilteredData}
      />
    );
  }

  if (loading) {
    return <Spin size="large" className="centered-spinner" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Layout className="admin-dashboard-container">
      <Header
        style={{
          background: "#fff",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          RS Fitness Gym Admin Dashboard
        </Title>
        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      <Content className="p-6 bg-gray-100 min-h-screen">
        <div className="admin-dashboard-container">
          <div className="p-6 bg-gray-100 min-h-screen">
            <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Title level={2} className="text-white mb-2">
                Welcome to RS Fitness Gym Admin Dashboard
              </Title>
              <Paragraph className="text-white mb-0">
                Here you can manage all aspects of your gym, including member
                information and performance tracking.
              </Paragraph>
            </Card>

            <Row gutter={16} className="mb-6">
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Members"
                    value={stats?.totalUsers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Active Users"
                    value={stats?.activeUsers}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Programs"
                    value={stats?.totalPrograms}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Popover
                    content={exerciseManagementContent}
                    title="Exercise Management"
                    trigger="click"
                    visible={popoverVisible}
                    onVisibleChange={handlePopoverVisibleChange}
                  >
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      style={{ width: "100%", height: "100%" }}
                    >
                      Manage Exercises
                    </Button>
                  </Popover>
                </Card>
              </Col>
            </Row>

            <Card className="mb-6">
              <Title level={3}>Member Directory</Title>
              <Paragraph>
                Below you'll find detailed information about all gym members.
                Use the search box to filter members by name or email. Click on
                a row to view detailed information. You can also toggle the
                active status of each user.
              </Paragraph>
              <Search
                placeholder="Search by name or email"
                allowClear
                enterButton="Search"
                size="large"
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={handleSearch}
                className="mb-4"
              />
              <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{
                  pageSize: 10,
                  total: filteredData.length,
                  showQuickJumper: true,
                }}
              />
            </Card>

            <Modal
              title="Add New Exercise"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form form={form} onFinish={handleAddExercise}>
                <Form.Item
                  name="name"
                  label="Exercise Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the exercise name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="link"
                  label="Link"
                  rules={[
                    {
                      required: true,
                      message: "Please input the YouTube link!",
                    },
                    { type: "url", message: "Please enter a valid URL!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add Exercise
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
