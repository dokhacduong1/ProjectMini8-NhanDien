import { useEffect, useState } from "react";
import WebcamFaceRecognition from "../../Components/WebcamFaceRecognition";
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { adminDb, auth, db } from "../../Config/Firebase";
import { getCurrentDay, getDataTime } from "../../helpers/dataTime";
import { Button, Card, Form, Input, Select, Tag } from "antd";
import "./FaceRecognition.scss";
import { useNavigate } from "react-router-dom";
function FaceRecognition() {
  const courseCollectionRef = collection(db, "course");
  const scheduleCollectionRef = collection(db, "schedule");
  const attendanceCollectionRef = collection(db, "attendance");
  const [scheduleSelect, setScheduleSelect] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fechApi = async () => {
      //Lấy dữ liệu từ hai bảng course và schedule
      const responseCourse = await getDocs(courseCollectionRef);
      const responseSchedule = await getDocs(scheduleCollectionRef);
      //Convert dữ liệu ra object dễ thao tác cho cả hay bảng
      const fullDataCourse = responseCourse.docs
        .filter(
          (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
        )
        .map((dataMap) => dataMap.data());

      const fullDataSchedule = responseSchedule.docs
        .filter(
          (dataFilter) => dataFilter.data().uidUser === auth?.currentUser?.uid
        )
        .map((dataMap) => dataMap.data());
      //Hàm này dùng check xem ngày hôm nay có khóa học nào nếu check trả ra -1 thì sẽ là không có khóa học nào
      const checkDaySchedule = fullDataSchedule.filter((dataFilter) => {
        return dataFilter.weekday.indexOf(getCurrentDay()) !== -1;
      });
      //Hàm này lọc dữ liệu giữa 2 bảng để lấy ra tên khóa học và lớp lấy ra bằng cách so sáng id khóa học và courseId bên Lịch Học
      const convertDataSelect = checkDaySchedule.map((dataMap) => {
        const response = fullDataCourse.filter(
          (dataFilter) => dataFilter.id === dataMap.courseId
        );

        return {
          value: dataMap?.id,
          label: (
            <div>
              {response[0]?.name} - <strong>{response[0]?.class}</strong> -{" "}
              <Tag color="default"> {dataMap.NumberOfPeriods}</Tag>
            </div>
          ),
        };
      });
      const convertDataFull = checkDaySchedule.map((dataMap) => {
        const response = fullDataCourse.filter(
          (dataFilter) => dataFilter.id === dataMap.courseId
        );
     
        return {
          class: response[0]?.class,
          name: response[0]?.name,
          idCourse: response[0]?.id,
          ...dataMap,
        };
      });
  
      setSchedule(convertDataFull);
      setScheduleSelect(convertDataSelect);
    };
    fechApi();
  }, []);

  const handleForm = async (valueForm) => {
    const scheduleData = schedule.filter(
      (dataFilter) => dataFilter.id === valueForm.id
    )[0];
    
    const responseAttendance = await getDocs(attendanceCollectionRef);
    const fullDataAttendance = responseAttendance.docs.map((dataMap) =>
      dataMap.data()
    );

    const checkData = fullDataAttendance.filter(
      (dataFilter) => dataFilter.idSchedule === valueForm.id
    );

    //Tạo biến linkId để hứng cái id mới của bảng attendance khi điểm danh từng khóa học nếu có rồi sẽ rơi vào else
    let linkId = "";
   
    if (checkData.length === 0) {
      //Neeus không có khóa học nào nó sẽ tự tạo trong firestore
      const newDocRef = doc(attendanceCollectionRef);
      const objectNew = {
        idSchedule: valueForm?.id,
        idCourse: scheduleData?.idCourse,
        NumberOfPeriods: scheduleData.NumberOfPeriods,
        class: scheduleData?.class,
        name: scheduleData?.name,
        id: newDocRef.id,
        attendanceData: [{
          date: getDataTime(),
          students: []
        }],

        uidUser: auth?.currentUser?.uid

      };
      linkId = newDocRef.id
      await setDoc(newDocRef, objectNew);

    } else {
      linkId = checkData[0].id
      //đoạn này check date ở trong mảng trên check xem attendanceData có ngày hôm nay chưa nếu chưa thì push ngày hôm nay vào
      if (!checkData[0].attendanceData.some(item => item.date === getDataTime())) {
        const movieDoc = doc(db, "attendance", checkData[0]?.id);
        checkData[0].attendanceData.push(
          {
            date: getDataTime(),
            students: []
          }
        )
        await updateDoc(movieDoc,checkData[0])
        
      }
    }

    navigate(`/face-recognition-start/${linkId}`);
  };

  return (
    <>
      <Card
        className="faceRecognition"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form
          form={form}
          className="faceRecognition__welcome-form"
          layout="inline"
          rules={{
            remember: true,
          }}
          onFinish={handleForm}
        >
          <Form.Item
            name="id"
            rules={[
              {
                required: true,
                message: "Vui Lòng Chọn ",
              },
            ]}
          >
            <Select
              options={scheduleSelect}
              style={{ width: 300 }}
              placeholder="Tìm Kiếm"
              className="faceRecognition__welcome-form-select"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="faceRecognition__form-button"
            >
              Bắt Đầu Điểm Danh {"  "}
            </Button>
          </Form.Item>
        </Form>
      </Card>

    </>
  );
}
export default FaceRecognition;
