import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Divider,
  message,
} from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { createDietPDF } from "../../services";

const { TextArea } = Input;
const { Title } = Typography;

const DietPlanForm = ({ id }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const modifiedDetailsMap = values?.detailsMap?.reduce((acc, item) => {
      acc[item.key.toLowerCase()] = item.value;
      return acc;
    }, {});

    const updatedValues = {
      ...values,
      id: id,
      detailsMap: modifiedDetailsMap,
    };

    createDietPDF(updatedValues)
      .then((response) => {
        if (response.success) {
          message.success("PDF generated successfully!");
          form.resetFields();
        } else {
          message.error(
            response.error || "Failed to generate PDF. Please try again."
          );
        }
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        message.error("An unexpected error occurred. Please try again.");
      });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="max-w-4xl mx-auto p-6"
    >
      <Card title="Create Diet Plan" className="mb-6">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          name="planName"
          label="Plan Name"
          rules={[{ required: true, message: "Please input the plan name!" }]}
        >
          <Input placeholder="Enter plan name" />
        </Form.Item>

        <Divider orientation="left">Details</Divider>
        <Form.List name="detailsMap">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    rules={[{ required: true, message: "Missing key" }]}
                  >
                    <Input placeholder="Key" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true, message: "Missing value" }]}
                  >
                    <Input placeholder="Value" />
                  </Form.Item>
                  <MinusOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Detail
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item name="note" label="Note">
          <TextArea rows={4} placeholder="Enter note" />
        </Form.Item>

        <Divider orientation="left">Meals</Divider>
        <Form.List name="mealList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Card key={field.key} style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Form.Item
                      {...field}
                      label="Meal Title"
                      name={[field.name, "title"]}
                      rules={[
                        { required: true, message: "Missing meal title" },
                      ]}
                    >
                      <Input placeholder="Meal Title" />
                    </Form.Item>
                    <Form.List name={[field.name, "meals"]}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map((itemField) => (
                            <Space
                              key={itemField.key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...itemField}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing meal item",
                                  },
                                ]}
                              >
                                <Input placeholder="Meal Item" />
                              </Form.Item>
                              <MinusOutlined
                                onClick={() => removeItem(itemField.name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addItem()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Meal Item
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Space>
                  <Button
                    type="link"
                    onClick={() => remove(field.name)}
                    icon={<DeleteOutlined />}
                  >
                    Remove Meal
                  </Button>
                </Card>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Meal
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Instructions</Divider>
        <Form.List name="instructions">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space
                  key={field.key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...field}
                    rules={[{ required: true, message: "Missing instruction" }]}
                  >
                    <Input placeholder="Instruction" />
                  </Form.Item>
                  <MinusOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Instruction
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Diet Plan
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default DietPlanForm;
