import { Button, Card, Form, Input, InputNumber, Select, notification } from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
function CoursesEdit() {
    const params = useParams();
    const { id } = params;
    const [api, contextHolder] = notification.useNotification();
    const studentsCollectionRef = collection(db, "students");
    const coursesCollectionRef = collection(db, "course");
    const [students, setStudents] = useState([]);

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            //Lấy doc của từng collection
            const responseCourses = await getDocs(coursesCollectionRef);
            const responseStudents = await getDocs(studentsCollectionRef);
            const optionStudents = responseStudents.docs.map((dataMap) => ({
                value: dataMap.data().id,
                label: (
                    <div>
                        Tên: <strong>{dataMap.data().name}</strong> - Id:{" "}
                        <strong>{dataMap.data().id}</strong> - Lớp:{" "}
                        <strong>{dataMap.data().class}</strong>
                    </div>
                ),
            }));
            const optionCourses = responseCourses.docs
                .filter((dataMap) => dataMap.data().id === id)
                .map((dataMap) => dataMap.data());

            setCourses(optionCourses);
            setStudents(optionStudents);
        };
        fetchApi();
    }, []);

    const handCoursesEdit = async (valueForm) => {
        const responseStudents = await getDocs(studentsCollectionRef);
        const movieDoc = doc(db, "course", id);
        //Nếu check ra undefined là người dùng chưa chọn gì ở phần select nếu chưa chọn ta sẽ lấy đúng id gốc của sinh viên
        if (valueForm.listStudentsNew === undefined) {
            valueForm.listStudentsNew = courses[0].listStudents.map(
                (data) => data.id
            );
        }
        let arrayData = [];
        //hàm này lọc sinh viên từ bảng students mục đích lấy dc cái name và cái id sinh viên
        valueForm.listStudentsNew.map((dataMap) => {
          
            responseStudents.docs
                .filter((dataStudents) => dataStudents.data().id === dataMap)
                .map((dataMapStudents) => {
                    arrayData.push({
                        name: dataMapStudents.data().name,
                        id: dataMapStudents.data().id,
                    });
                });
        });
        //object này convert lại giống bảng course thôi
        const objectNew = {
            class: valueForm.class,
            listStudents: arrayData,
            name: valueForm.name,
            totalClassPeriods: valueForm.totalClassPeriods
        };
        try {
            await updateDoc(movieDoc, objectNew);
            api.success({
                message: `Cập Nhật Thành Công`,
                description: (
                    <>
                        Bạn Đã Sửa Thành Công Khóa Học <strong>{valueForm.name}</strong>
                    </>
                ),
            });
        } catch {
            api.error({
                message: `Cập Nhật Thất Bại`,
                description: <>Vui Lòng Cập Nhật Lại</>,
            });
        }
    };

    return (
        <>
            {contextHolder}
            <div>
                <Button className="button-back">
                    <Link to="#" onClick={() => window.history.back()}>
                        Quay lại
                    </Link>
                </Button>
            </div>
            {courses.length > 0 && (
                <>
                    <Card className="coursesEdit">
                        <Form
                            initialValues={courses[0]}
                            className="coursesEdit__form"
                            rules={{
                                remember: true,
                            }}
                            layout="vertical"
                            onFinish={handCoursesEdit}
                        >
                            <h3>Sửa Khóa Học</h3>
                            <Form.Item
                                label="Tên Khóa Học"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui Lòng Nhập Tên Khóa Học!",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Tên Sinh Khóa Học"
                                    className="addStudents__form-input"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Lớp"
                                name="class"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui Chọn Lớp",
                                    },
                                ]}
                            >
                                <Select
                                    disabled
                                    className="addStudents__form-input"
                                    style={{ width: 120 }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tổng Số Tiết Phải Học"
                                name="totalClassPeriods"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui Chọn Lớp",
                                    },
                                ]}
                            >
                                <InputNumber className="addCourses__form-input" min={1} max={100} />
                            </Form.Item>
                            <Form.Item label="Danh Sách Sinh Viên" name="listStudentsNew">
                                <Select
                                    defaultValue={courses[0].listStudents.map((data) => data.id)}
                                    mode="multiple"
                                    placeholder="Please select"
                                    style={{ width: "100%" }}
                                    options={students}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="addStudents__form-button"
                                >
                                    Sửa Khóa Học
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </>
            )}
        </>
    );
}
export default CoursesEdit;
