import { useEffect, useState, useRef } from "react";
import {
  Form,
  Table,
  Space,
  Popconfirm,
  Typography,
  message,
  Input,
  InputNumber,
  Button,
} from "antd";
import {
  useGetStudentsQuery,  
  useDelStudentMutation,
  useUpdateStudentMutation,
} from "../../store/api/studentApi";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

//定义可编辑表格项
const editableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  // record,
  // index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : (
      <Input style={{ textAlign: "center" }} />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: "0 auto",
            maxWidth: "150px",
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const StudentTable = () => {
  //表单功能的引用
  const [form] = Form.useForm();
  //定义表格编辑功能的状态
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  //引入信息提示
  const [messageApi, contextHolder] = message.useMessage();

  //获取学生数据
  const { data: students, isSuccess } = useGetStudentsQuery(null, {
    skip: false, // 设置是否跳过当前请求，默认false
    refetchOnMountOrArgChange: false, // 设置是否每次都重新加载数据 false正常使用缓存，
    // true每次都重载数据
    //数字，数据缓存的时间（秒）
    refetchOnFocus: false, // 是否在重新获取焦点时重载数据
    refetchOnReconnect: true, // 是否在重新连接后重载数据
  });
  // console.log(students);

  //将学生数据移交给表单数据项
  const data = students?.map((item) => {
    return {
      key: item.documentId,      
      name: item.name,
      age: item.age,
      gender: item.gender,
      address: item.address,
    };
  });
  // console.log(data);

  //引用修改学生数据的方法
  const [updateStudent, { isSuccess: isUpdateSuccess }] =
    useUpdateStudentMutation();

  //编辑功能的启动，取消，及保存提交
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      gender: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });        
        updateStudent(newData[index]).then((res) => {
          // console.log(res);
          if (res.error) {
            messageApi.open({
              type: "error",
              content: res.error.data.error.message,
            });
          }
        });       
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  //定义姓名的搜索功能
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //表单结构定义
  const columns = [
    {
      title: "Num",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "20px",
      render: (text, record, index) =>
        `${(pageOption.pageNo - 1) * 10 + (index + 1)}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      editable: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      align: "center",
      editable: true,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        {
          text: "男",
          value: "男",
        },
        {
          text: "女",
          value: "女",
        },
      ],
      key: "gender",
      align: "center",
      editable: true,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.gender.startsWith(value),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item, record) => {
        // console.log(item)
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 6,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
            {/* 删除功能 */}
            <Popconfirm
              title="是否确定删除?"
              onConfirm={() => {
                delStudent(item.key).then((res) => {
                  if (res.error) {
                    messageApi.open({
                      type: "error",
                      content: res.error.data.error.message,
                    });
                  }
                });
              }}
            >
              <Typography.Link>删除</Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //页面设置
  const [pageOption, setPageOption] = useState({
    pageNo: 1,
    pageSize: 10,
  });
  // 定义分页信息
  const pagination = {
    total: data?.length,
    pageSize: pageOption.pageSize,
    current: pageOption.pageNo,
    onChange: (pageNo) => {
      setPageOption({ ...pageOption, pageNo });
    },
  };
  //定义可修改的新的列
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  //删除学生功能
  const [delStudent, { isSuccess: isDelOk }] = useDelStudentMutation();
  //删除及修改成功后触发信息提示
  useEffect(() => {
    if(isSuccess){
      messageApi.open({
        type: "success",
        content: "成功获取学生列表",
      });
    }
    if (isDelOk) {
      messageApi.open({
        type: "success",
        content: "删除学生成功",
      });
    }
    if (isUpdateSuccess) {
      messageApi.open({
        type: "success",
        content: "修改学生信息成功",
      });
    }
  }, [isDelOk, isUpdateSuccess, isSuccess, messageApi]);

  return (
    <>
      {contextHolder}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: editableCell,
            },
          }}
          bordered
          columns={mergedColumns}
          pagination={pagination}
          dataSource={data}
          size={"small"}
          // rowKey="key"
        />
      </Form>
    </>
  );
};

export default StudentTable;
