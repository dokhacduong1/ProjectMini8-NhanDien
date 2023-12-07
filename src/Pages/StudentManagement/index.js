import {
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import FormEditStudents from "../../Components/FormEditStudents";
import "./StudentManagement.scss";
import { deleteTrainData, getDataTrainByLabel } from "../../services/trainData";

function StudentManagement() {
  const studentsCollectionRef = collection(db, "students");
  const [dataStudents, setDataStudents] = useState([]);
  const fetchApi = async () => {
    const data = await getDocs(studentsCollectionRef);
    const dataDocAll = data.docs.map((dataDoc) => dataDoc.data());
    setDataStudents(dataDocAll);
  };

  useEffect(() => {
    fetchApi();
  }, []);
  const handeleDelete = async (idRecord) => {
    const movieDoc = doc(db, "students", idRecord);
    //Đoạn này lấy id từ label của json server tại trước mình để label nó là id của bên firestore luông
    const responseGetData = await getDataTrainByLabel(idRecord)
    await deleteTrainData(responseGetData[0].id)
    await deleteDoc(movieDoc);

    fetchApi();
  };
  const columns = [
    {
      key: "0",
      title: "Id",
      dataIndex: "id",
      align: "center",
    },
    {
      key: "1",
      title: "Lớp",
      dataIndex: "class",
      align: "center",
    },
    {
      key: "2",
      title: "Tên",
      dataIndex: "name",
      align: "center",
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      key: "4",
      title: "Giới Tính",
      dataIndex: "sex",

      render: (_, record) => (
        <>
          {record.sex === "boy" ? (
            <Tag color="blue">Nam</Tag>
          ) : (
            <Tag color="pink">Nữ</Tag>
          )}
        </>
      ),
      align: "center",
    },
    {
      key: "5",
      title: "Ngày Sinh",
      dataIndex: "date",
      align: "center",
    },
    {
      title: "Hành Động",
      dataIndex: "ok",
      key: "ok",
      render: (_, record) => (
        <>
          <div className="studentManagement__table-iconAction">
            <span
              style={{
                color: "rgb(0, 150, 45)",
                border: "1px solid rgb(0, 150, 45)",
                borderRadius: "4px",
              }}
            >
              <FormEditStudents record={record} fetchApiLoad={fetchApi} />
            </span>

            <span
              style={{
                color: "red",
                border: "1px solid red",
                borderRadius: "4px",
              }}
            >
              <Popconfirm
                title="Xóa Sinh Viên"
                description="Bạn Có Muốn Xóa Sinh Viên Này Không ?"
                okText="Ok"
                cancelText="No"
                onConfirm={() => {
                  handeleDelete(record.id);
                }}
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
          </div>
        </>
      ),
      align: "center",
    },
  ];

  const handleForm = async (valueForm) => {
    const data = await getDocs(studentsCollectionRef);
    let dataDocAll = [];
    if (valueForm.select !== "all") {
      dataDocAll = data.docs
        .map((dataDoc) => dataDoc.data())
        .filter(
          (dataFilter) => dataFilter[valueForm.select] === valueForm.keyword
        );
    } else {
      dataDocAll = data.docs.map((dataDoc) => dataDoc.data());
    }
    setDataStudents(dataDocAll);
  };
  const optionsSelect = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "name",
      label: "Tên Sinh Viên",
    },
    {
      value: "id",
      label: "Id Sinh Viên",
    },
    {
      value: "email",
      label: "Email Sinh Viên",
    },
    {
      value: "class",
      label: "Lớp Sinh Viên",
    },
  ];
  return (
    <Card className="studentManagement">
      <Form
        className="home__welcome-form"
        layout="inline"
        rules={{
          remember: true,
        }}
        onFinish={handleForm}
      >
        <Form.Item
          name="select"
          rules={[
            {
              required: true,
              message: "Vui Lòng Chọn ",
            },
          ]}
        >
          <Select
            options={optionsSelect}
            style={{ width: 170 }}
            placeholder="Tìm Kiếm"
            className="home__welcome-form-select"
          />
        </Form.Item>
        <Form.Item name="keyword">
          <Input
            style={{ width: 230 }}
            className="home__welcome-form-input"
            placeholder="Nhập Từ Khóa..."
          />
        </Form.Item>

        <Form.Item>
          <Button
            className="home__welcome-form-button"
            type="primary"
            htmlType="submit"
          >
            <SearchOutlined /> Search
          </Button>
        </Form.Item>
      </Form>
      <Table
        pagination={false}
        rowKey="id"
        columns={columns}
        dataSource={dataStudents}
      />
    </Card>
  );
}
export default StudentManagement;
