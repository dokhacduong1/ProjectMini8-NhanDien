import { Button, Card, Form, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { auth, db } from "../../Config/Firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import "./AddSchedule.scss";
import { getCurrentDay } from "../../helpers/dataTime";
function AddSchedule() {
    const coursesCollectionRef = collection(db, "course");
    const scheduleCollectionRef = collection(db, "schedule");
    const [courses, setCourses] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const { Option } = Select;
    useEffect(() => {
        const fetchApi = async () => {
            const responseCourses = await getDocs(coursesCollectionRef);
            const optionCourses = responseCourses.docs
                .filter(
                    (dataFilter) => dataFilter.data().uidUser === auth?.currentUser.uid
                )
                .map((dataMap) => ({
                    value: dataMap.data().id,
                    label: <div>{dataMap.data().name} - <strong>{dataMap.data().class}</strong></div>,
                }));
            setCourses(optionCourses);
        };
        fetchApi();
    }, []);
    const handleAddSchedule = async (valueForm) => {
        const newDocRef = doc(scheduleCollectionRef);
       const objectData ={
        ...valueForm,
        id:newDocRef.id,
        uidUser:auth?.currentUser.uid
       }
       
       
      try{
        await setDoc(newDocRef, objectData);
        messageApi.open({
            type: 'success',
            content: `Thêm Thành Công Lịch Học`,
        });
      }catch{

      }
    };
  
    return (
        <>
         {contextHolder}
            <Card
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                className="addSchedule"
            >
                <Form
                    className="addSchedule__form"
                    layout="vertical"
                    rules={{
                        remember: true,
                    }}
                    onFinish={handleAddSchedule}
                >
                    <Form.Item
                        name="weekday"
                        label="Thứ"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn ",
                            },
                        ]}
                    >
                        <Select
                            className="addSchedule__form-input"
                            mode="multiple"
                            style={{ width: "100%" }}
                        >
                            <Option value="monday">Thứ Hai</Option>
                            <Option value="tuesday">Thứ Ba</Option>
                            <Option value="wednesday">Thứ Tư</Option>
                            <Option value="thursday">Thứ Năm</Option>
                            <Option value="friday">Thứ Sáu</Option>
                            <Option value="saturday">Thứ Bảy</Option>
                            <Option value="sunday">Chủ Nhật</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="courseId"
                        label="Khóa Học"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn ",
                            },
                        ]}
                    >
                        <Select
                            className="addSchedule__form-input"
                            options={courses}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="NumberOfPeriods"
                        label="Số Tiết Học"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn ",
                            },
                        ]}
                    >
                        <InputNumber className="addSchedule__form-input" min={1} max={10} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="addSchedule__form-button"
                        >
                            Tạo Mới Lịch Học
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}
export default AddSchedule;
