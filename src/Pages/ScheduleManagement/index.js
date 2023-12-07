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
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { } from "react-router-dom";
import "./ScheduleManagement.scss";
import FormEditSchedule from "../../Components/FormEditSchedule";
function ScheduleManagement() {
  const scheduleCollectionRef = collection(db, "schedule");
  const courseCollectionRef = collection(db, "course");
  const [schedule, setSchedule] = useState([]);
  const fetchApi = async () => {
    const dataSchedule = await getDocs(scheduleCollectionRef);
    const dataCourse = await getDocs(courseCollectionRef);
    //Lấy dữ liệu bảng Schedule
    const dataDocAllSchedulel = dataSchedule.docs
      .filter((dataDoc) => dataDoc.data().uidUser === auth?.currentUser.uid)
      .map((dataMap) => dataMap.data());
    //Lấy dữ liệu bảng Course
    const dataDocAllCourse = dataCourse.docs.map((dataDoc) => dataDoc.data());
    //Hàm này lấy tên môn học,và tên lớp cho bào một object mới
    const convertData = dataDocAllSchedulel.map((dataMap) => {
      const response = dataDocAllCourse.filter(
        (dataFilter) => dataFilter.id === dataMap.courseId
      );

      return {
        class: response[0]?.class,
        name: response[0]?.name,
        ...dataMap,
      };
    });

    setSchedule(convertData);
  };
  useEffect(() => {

    fetchApi();
  }, []);


  const handeleDelete = async (idRecord) => {
    const movieDoc = doc(db, "schedule", idRecord);

    await deleteDoc(movieDoc);
    fetchApi();

  };
  const handleForm = async (valueForm) => {
    const dataSchedule = await getDocs(scheduleCollectionRef);
    const dataCourse = await getDocs(courseCollectionRef);
    const dataDocAllCourse = dataCourse.docs.map((dataDoc) => dataDoc.data());
    let dataDocAllSchedule = [];
    if (valueForm.select !== "all") {
      //Đoạn này nó check tên trùng sẽ lấy dữ liệu ở schedule cái useState ở trên
      dataDocAllSchedule = schedule.filter(
        (dataFilter) => dataFilter[valueForm.select] === valueForm.keyword
      );
    } else {
      //đoạn này ta không gán cho schedule được vì trường hợp tìm kiếm khác all nó sẽ thay đổi bằng hàm setSchedule lên ta phải lấy lại dữ liệu ban đầu
      dataDocAllSchedule = dataSchedule.docs
        .filter((dataDoc) => dataDoc.data().userId === auth?.currentUser.uid)
        .map((dataMap) => dataMap.data());
    }
    //đoạn này như trên đầu nó convert dữ liệu về cho thêm tên lớp và class vào để hứng giá trị thay đổi table
    const convertData = dataDocAllSchedule.map((dataMap) => {
      const response = dataDocAllCourse.filter(
        (dataFilter) => dataFilter.id === dataMap.courseId
      );

      return {
        class: response[0]?.class,
        name: response[0]?.name,
        ...dataMap,
      };
    });
    setSchedule(convertData);
  };
  const optionsSelect = [
    {
      value: "all",
      label: "Tất Cả",
    },
    {
      value: "name",
      label: "Tên Khóa Học",
    },
    {
      value: "class",
      label: "Tên Lớp",
    },
  ];
  const columns = [
    {
      key: "0",
      title: "id",
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
      title: "Tên Khóa Học",
      dataIndex: "name",
      align: "center",
    },
    {
      key: "4",
      title: "Số Tiết Học",
      dataIndex: "NumberOfPeriods",
      align: "center",
    },
    {
      key: "5",
      title: "Các Ngày Dạy",
      dataIndex: "weekday",
      render: (_, value) =>
        value.weekday.map((dataMap, index) => <Tag key={index} color="geekblue">{dataMap}</Tag>),
      align: "center",
    },
    {
      title: "Hành Động",
      dataIndex: "ok",
      key: "6",
      render: (_, record) => (
        <>
          <div className="scheduleManagement__table-iconAction">
            <span
              style={{
                color: "rgb(0, 150, 45)",
                border: "1px solid rgb(0, 150, 45)",
                borderRadius: "4px",
              }}
            >
              <FormEditSchedule record={record} fetchApiLoad={fetchApi} />
            </span>

            <span
              style={{
                color: "red",
                border: "1px solid red",
                borderRadius: "4px",
              }}
            >
              <Popconfirm
                title="Xóa Lịch Học"
                description="Bạn Có Muốn Xóa Lịch Học Này Không ?"
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
  return (
    <>
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
          dataSource={schedule}
        />
      </Card>
    </>
  );
}
export default ScheduleManagement;
