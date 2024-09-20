import { useEffect, useState } from "react";
import { Card, Button, Form, Input, Modal, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAddStudentMutation } from "../store/api/studentApi";
import StudentTable from "../components/StudentTable";

const StudentList = () => {
  //引入信息提示
  const [messageApi, contextHolder] = message.useMessage();

  //增加学生的功能
  const [addStudent, { isSuccess: isAddSuccess }] = useAddStudentMutation();
  const addStudentHandler = (newData) => {
    addStudent(newData);
    // console.log(newData);
    form.resetFields();
  };

  //弹出信息框的处理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  //操作成功的提示信息
  useEffect(() => {
    if (isAddSuccess) {
      messageApi.open({
        type: "success",
        content: "添加学生成功",
      });
    }
  }, [isAddSuccess, messageApi]);

  
  return (
    <>
      {contextHolder}
      <Card
        title="学生列表"
        extra={
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            ></Button>
          </div>
        }
        style={{ width: "100%" }}
      >
        <StudentTable />
      </Card>
      <Modal
        title="录入学生数据"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form          
          labelCol={{span:4}}
          form={form}          
          onFinish={addStudentHandler}
        >
          <Form.Item label="Name" name="name">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item label="Gender" name="gender" initialValue="男">
            <Select
              style={{ width: "100%" }}
              options={[
                { value: "男", label: "男" },
                { value: "女", label: "女" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input placeholder="请输入地址" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StudentList;
