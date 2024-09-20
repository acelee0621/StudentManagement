import { useState } from "react";
import { Card, Button, Form, Input, Table, Modal } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ImgUpload from "../components/ImgUpload";



const columns = [
  {
    title: "Num",
    dataIndex: "key",
    key: "key",
    width: "60px",
    align: "center",
    render: (n) => {
      return <span>{n}</span>;
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "ID Photo",
    dataIndex: "id_photo",
    key: "id_photo",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "Lake Park",
  },
];

const StudentType = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

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

  return (
    <>
      <Card
        title="学生分类"
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
        <Form layout="inline">
          <Form.Item label="姓名">
            <Input placeholder="请输入要查询的姓名" />
          </Form.Item>
          <Form.Item label="姓名">
            <Button type="primary" icon={<SearchOutlined />}></Button>
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={data} />
      </Card>
      <Modal
        title="编辑输入框"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          onFinish={(n) => {
            console.log(n);
          }}
        >
          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="照片" name="id_photo">
            <ImgUpload />
          </Form.Item>
          <Form.Item label="简介" name="desc">
            <Input.TextArea placeholder="请输入简介" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StudentType;
