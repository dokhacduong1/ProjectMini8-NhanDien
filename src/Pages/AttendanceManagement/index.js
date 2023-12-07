import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../Config/Firebase";
import { Button, Card, Form, Input, Select, Table, Tag } from "antd";
import OverviewDiagram from "../../Components/OverviewDiagram";

function AttendanceManagement() {
    const params = useParams();
    const { id } = params;
    const attendanceCollectionRef = collection(db, "attendance");
    const coursesCollectionRef = collection(db, "course");
    const [attendance, setAttendance] = useState([]);
    const [courses, setCourses] = useState([]);
    const [options, setOptions] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const responseCourse = await getDocs(coursesCollectionRef);
            const responseAttendance = await getDocs(attendanceCollectionRef);
            const fullDataAttendance = responseAttendance.docs
                .filter((dataFilter) => dataFilter.data().id === id)
                .map((dataMap) => dataMap.data());

            const fullDataCourse = responseCourse.docs
                .filter(
                    (dataFilter) =>
                        dataFilter.data().uidUser === auth?.currentUser.uid &&
                        dataFilter.data().id === fullDataAttendance[0].idCourse
                )
                .map((dataMap) => dataMap.data());
           
            const option = fullDataAttendance[0].attendanceData.map((dataMap) => {
                return {
                    value: dataMap.date,
                    label: dataMap.date,
                };
            });
            
            setOptions(option);
            setAttendance(fullDataAttendance);
            setCourses(fullDataCourse);
        };
        fetchApi();
    }, []);
    const onFinish = async (valueForm) => {
        const checkStudents = attendance[0].attendanceData.filter(
            (dataFilter) => dataFilter.date === valueForm.date
        );
        console.log(checkStudents)
        const dataTable = courses[0].listStudents.map((dataMap) => {
            const check = checkStudents[0].students.some(
                (dataSome) => dataSome.idStudent === dataMap.id
            );
            return {
                ...dataMap,
                check,
            };
        });
        setDataSource(dataTable);
    };

    console.log(courses);
    const columns = [
        {
            title: "Id Sinh Viên",
            dataIndex: "id",
            key: "id",
            align: "center",
        },
        {
            title: "Tên Sinh Viên",
            dataIndex: "name",
            key: "name",
            align: "center",
        },

        {
            title: "Trạng Thái Điểm Danh",
            dataIndex: "check",
            key: "check",
            render: (_, value) => (
                <>
                    {value.check ? (
                        <Tag color="success">Đã Điểm Danh</Tag>
                    ) : (
                        <Tag color="error">Nghỉ Học</Tag>
                    )}
                </>
            ),
            align: "center",
        },
    ];

    return (
        <>
            {attendance.length > 0 && (
                <>
                    <Card>
                        <h1 style={{ textAlign: "center" }}>
                            Môn Học: <Tag color="#cd201f">{courses[0].name}</Tag>
                        </h1>
                        <Form
                            name="customized_form_controls"
                            layout="inline"
                            onFinish={onFinish}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Form.Item
                                name="date"
                                label="Chọn Ngày"
                                rules={[{ required: true, message: "Vui Lòng Chọn Ngày!" }]}
                            >
                                <Select
                                    options={options}
                                    style={{
                                        width: 220,
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    className="home__welcome-form-button"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Chi Tiết Ngày Điểm Danh
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card>
                        <Table rowKey={"name"} dataSource={dataSource} columns={columns} />
                    </Card>
                    <Card>
                        <h2 style={{ textAlign: "center" }}>Sơ Đồ Tổng Quát</h2>
                        <OverviewDiagram attendance={attendance} />
                    </Card>
                </>
            )}
        </>
    );
}
export default AttendanceManagement;
