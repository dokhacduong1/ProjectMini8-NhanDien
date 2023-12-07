import {
    Button,
    Card,
    Form,
    Input,
    Popconfirm,
    Select,
    Table,
  } from "antd";
  import { useEffect, useState } from "react";
  import {
    getDocs,
    collection,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import { auth, db } from "../../Config/Firebase";
  import { EyeOutlined, DeleteOutlined, SearchOutlined,EditOutlined } from "@ant-design/icons";
  import {  useNavigate } from "react-router-dom";
import "./CoursesManagement.scss"
function CoursesManagement(){
    const courseCollectionRef = collection(db, "course");
    const [dataCourse, setDataCourse] = useState([]);
    const navigate = useNavigate();
    const fetchApi = async () => {
      const data = await getDocs(courseCollectionRef);
      //ĐOạn này check xem uid có thêm khóa học nào không
      const dataDocAll = data.docs.filter((dataDoc) => dataDoc.data().uidUser === auth?.currentUser?.uid).map(dataMap =>(dataMap.data()));
      setDataCourse(dataDocAll);
    };
  
    useEffect(() => {
      fetchApi();
    }, []);
    const handeleDelete = async (idRecord) => {
        const movieDoc = doc(db, "course", idRecord);
      
          await deleteDoc(movieDoc);
     
        fetchApi();
      };
      const handleForm = async (valueForm) => {
        const data = await getDocs(courseCollectionRef);
        let dataDocAll = []
        if(valueForm.select !== "all"){
            dataDocAll  = data.docs.map((dataDoc) => dataDoc.data()).filter(dataFilter =>(dataFilter[valueForm.select] === valueForm.keyword));
        }else{
            dataDocAll = data.docs.filter((dataDoc) => dataDoc.data().uidUser === auth?.currentUser?.uid).map(dataMap =>(dataMap.data()));
        }
        setDataCourse(dataDocAll);
       
      };
      const handleClickStatus = async (idValue)=>{
        navigate(`/courses-views/${idValue}`)
      }
      const handleEditCourses = async (idValue)=>{
        navigate(`/courses-edit/${idValue}`)
      }
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
        title: "Tên Khóa Học",
        dataIndex: "name",
        align: "center",
      },
      {
        key: "3",
        title: "Tổng Số Tiết Khóa Học",
        dataIndex: "totalClassPeriods",
        align: "center",
      },
      {
        title: "Hành Động",
        dataIndex: "ok",
        key: "ok",
        render: (_, record) => (
          <>
            <div className="coursesManagement__table-iconAction">
            <span onClick={()=>{
                            handleClickStatus(record.id)
                        }}
                            style={{
                                color: "black",
                                border: "1px solid black",
                                borderRadius: "4px",
                            }}
                        >
                            <EyeOutlined />
                        </span>
              <span
                style={{
                  color: "rgb(0, 150, 45)",
                  border: "1px solid rgb(0, 150, 45)",
                  borderRadius: "4px",
                }}
              >
                <EditOutlined
                  onClick={()=>{handleEditCourses(record.id)}}
                />
              </span>
  
              <span
                style={{
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "4px",
                }}
              >
                <Popconfirm
                  title="Xóa Khóa Học"
                  description="Bạn Có Muốn Xóa Khóa Học Này Không ?"
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
    
   
    const optionsSelect = [
      {
        value: "all",
        label: "All",
      },
      {
        value: "id",
        label: "Id Khóa Học",
      },
      {
        value: "class",
        label: "Lớp Khóa Học",
      },
      {
        value: "name",
        label: "Tên Khóa Học",
      },
    ];
    return (
      <Card className="coursesManagement">
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
          dataSource={dataCourse}
        />
      </Card>
    );
}
export default CoursesManagement