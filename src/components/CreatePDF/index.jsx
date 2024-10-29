import React, { useState, useEffect } from "react";
import { Form, Input, Button, Space, Typography, Divider, message, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { createPDF, getAllExercises } from "../../services";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ExerciseInputs = ({ field, remove, exercises }) => {
  const [form] = Form.useForm();

  const handleExerciseChange = (value, option) => {
    form.setFieldsValue({
      [field.name]: {
        ...form.getFieldValue(field.name),
        link: option.link,
      },
    });
  };

  return (
    <Space
      key={field.key}
      style={{ display: "flex", marginBottom: 8 }}
      align="baseline"
    >
      <Form.Item
        name={[field.name, "name"]}
        noStyle
        rules={[{ required: true, message: "Please select an exercise" }]}
      >
        <Select
          style={{ width: 150 }}
          placeholder="Select Exercise"
          onChange={handleExerciseChange}
        >
          {exercises.map((exercise) => (
            <Option key={exercise.id} value={exercise.name} link={exercise.link}>
              {exercise.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name={[field.name, "description"]} noStyle>
        <Input placeholder="Description" style={{ width: 200 }} />
      </Form.Item>
      <Form.Item name={[field.name, "sets"]} noStyle>
        <Input placeholder="Sets" style={{ width: 80 }} />
      </Form.Item>
      <Form.Item name={[field.name, "reps"]} noStyle>
        <Input placeholder="Reps" style={{ width: 80 }} />
      </Form.Item>
      <MinusCircleOutlined onClick={() => remove(field.name)} />
    </Space>
  );
};

const FitnessProgramForm = ({ onCancel, id }) => {
  const [form] = Form.useForm();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await getAllExercises();
        setExercises(response.data.exercises);
      } catch (err) {
        message.error("Failed to fetch exercises. Please try again later.");
      }
    };
    fetchExercises();
  }, []);

  const onFinish = (values) => {
    const updatedWorkoutList = (values?.workoutList || []).map((workoutItem) => {
      if (!workoutItem) return null;
    
      ["warmup", "workout", "cooldown"].forEach((category) => {
        if (Array.isArray(workoutItem[category])) {
          workoutItem[category] = workoutItem[category].map((exercise) => {
            if (!exercise) return null;
            
            const matchingExercise = (exercises || []).find(
              (ex) => ex?.name === exercise.name
            );
            return {
              ...exercise,
              link: matchingExercise?.link || "",
            };
          }).filter(Boolean); // Remove null entries
        }
      });
      return workoutItem;
    }).filter(Boolean); // Remove null entries

    // Replace the workoutList in values with updatedWorkoutList and append id
    const updatedValues = { ...values, workoutList: updatedWorkoutList, id: id };
    createPDF(updatedValues)
      .then((response) => {
        if (response.success) {
          message.success("PDF generated successfully!");
          form.resetFields();
          if (onCancel) onCancel();
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
      style={{ maxWidth: 1000 }}
    >
      <Form.Item name="title" label="Title">
        <Input placeholder="Fitness Program" />
      </Form.Item>

      <Form.Item name="planName" label="Plan Name">
        <Input placeholder="Super Shred" />
      </Form.Item>

      <Form.Item name="explanation" label="Explanation">
        <TextArea placeholder="Write about the program here." rows={4} />
      </Form.Item>

      <Divider orientation="left">Feedback</Divider>
      <Form.List name="feedbackList">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={index === 0 ? "Feedback" : ""}
                required={false}
                key={field.key}
              >
                <Space>
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    noStyle
                  >
                    <Input
                      placeholder="Write about the feedback here."
                      style={{ width: 300 }}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  )}
                </Space>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add Feedback
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider orientation="left">Instructions</Divider>
      <Form.List name="instructionList">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={index === 0 ? "Instructions" : ""}
                required={false}
                key={field.key}
              >
                <Space>
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    noStyle
                  >
                    <Input
                      placeholder="Write about the instructions here."
                      style={{ width: 300 }}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  )}
                </Space>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add Instruction
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider orientation="left">Weekly Schedule</Divider>
      <Form.List name="scheduleList">
        {(weekFields, { add: addWeek, remove: removeWeek }) => (
          <>
            {weekFields.map((weekField, weekIndex) => (
              <div
                key={weekField.key}
                style={{
                  marginBottom: 24,
                  border: "1px solid #f0f0f0",
                  padding: 16,
                  borderRadius: 4,
                }}
              >
                <Space style={{ marginBottom: 16 }}>
                  <Text strong>Week {weekIndex + 1}</Text>
                  <Form.Item name={[weekField.name, "name"]} noStyle>
                    <Input
                      placeholder={`Weekly Schedule ${weekIndex + 1}`}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </Space>
                <Form.List name={[weekField.name, "days"]}>
                  {(dayFields, { add: addDay, remove: removeDay }) => (
                    <>
                      {dayFields.map((dayField) => (
                        <Space
                          key={dayField.key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...dayField}
                            name={[dayField.name, "day"]}
                            noStyle
                          >
                            <Input placeholder="Day" style={{ width: 100 }} />
                          </Form.Item>
                          <Form.Item
                            {...dayField}
                            name={[dayField.name, "bodyPart"]}
                            noStyle
                          >
                            <Input
                              placeholder="Body Part"
                              style={{ width: 150 }}
                            />
                          </Form.Item>
                          <Form.Item
                            {...dayField}
                            name={[dayField.name, "link"]}
                            noStyle
                          >
                            <Input placeholder="Link" style={{ width: 200 }} />
                          </Form.Item>
                          <MinusCircleOutlined
                            onClick={() => removeDay(dayField.name)}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => addDay()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Day
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                {weekFields.length > 1 && (
                  <Button
                    onClick={() => removeWeek(weekField.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove Week
                  </Button>
                )}
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => addWeek()}
                block
                icon={<PlusOutlined />}
              >
                Add Week
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider orientation="left">Daily Schedule</Divider>
      <Form.List name="workoutList">
        {(dayFields, { add: addDay, remove: removeDay }) => (
          <>
            {dayFields.map((dayField, dayIndex) => (
              <div
                key={dayField.key}
                style={{
                  marginBottom: 24,
                  border: "1px solid #f0f0f0",
                  padding: 16,
                  borderRadius: 4,
                }}
              >
                <Space align="baseline" style={{ marginBottom: 16 }}>
                  <Text strong>Day {dayIndex + 1}</Text>
                  <Form.Item name={[dayField.name, "name"]} noStyle>
                    <Input placeholder="Day Name" style={{ width: 150 }} />
                  </Form.Item>
                </Space>
                {["warmup", "workout", "cooldown"].map((section) => (
                  <div key={section}>
                    <Text strong style={{ marginBottom: 8, display: "block" }}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Text>
                    <Form.List name={[dayField.name, section]}>
                      {(
                        exerciseFields,
                        { add: addExercise, remove: removeExercise }
                      ) => (
                        <>
                          {exerciseFields.map((exerciseField) => (
                            <ExerciseInputs
                              key={exerciseField.key}
                              field={exerciseField}
                              remove={removeExercise}
                              exercises={exercises}
                            />
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addExercise()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Exercise
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ))}
                {dayFields.length > 1 && (
                  <Button
                    onClick={() => removeDay(dayField.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove Day
                  </Button>
                )}
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => addDay()}
                block
                icon={<PlusOutlined />}
              >
                Add Day
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Divider orientation="left">Key Points</Divider>
      <Form.List name="keyPointList">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                label={index === 0 ? "Key Points" : ""}
                required={false}
                key={field.key}
              >
                <Space>
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    noStyle
                  >
                    <Input
                      placeholder="Enter a key point here."
                      style={{ width: 300 }}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  )}
                </Space>
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add Key Point
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Create PDF
          </Button>
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FitnessProgramForm;