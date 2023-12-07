import { Button, Card, Col, Row, Tag } from "antd"
import { Link, useParams } from "react-router-dom"
import { db } from "../../Config/Firebase";

import { collection, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./CourseViews.scss"
function CoursesViews() {
    const param = useParams();
    const { id } = param;
    const coursesCollectionRef = collection(db, "course");
    const [course, setCourse] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const responseCourses = await getDocs(coursesCollectionRef);
            const fullDataCourse = responseCourses.docs.filter(dataMap => (dataMap.data().id === id)).map(dataMap => (dataMap.data()));
            setCourse(fullDataCourse);
        }
        fetchApi();
    }, [])
    return (
        <>
            <div>
                <Button className="button-back">
                    <Link to="#" onClick={() => window.history.back()}>
                        Quay lại
                    </Link>
                </Button>
            </div>
            {
                course.length > 0 && (<>
                    <Card className="coursesViews" style={{ textAlign: "center" }}>
                        <Row gutter={20} className="coursesViews__list">
                            <Col span={24} className="coursesViews__list-header">
                                <h2>Học Phần: <strong>{course[0].name}</strong></h2>
                                <h2>Lớp: <strong>{course[0].class}</strong> </h2>
                            </Col>

                            <Col span={24} className="coursesViews__list-body">
                                <h2>Danh Sách Sinh Viên Đăng Ký Khóa Học</h2>
                               
                                <div>
                                    {
                                        course[0].listStudents.map(dataMap=>(
                                            <Tag color="default">{dataMap.name}</Tag>
                                        ))
                                    }
                                </div>
                               
                            </Col>
                        </Row>
                    </Card>
                </>)
            }

        </>
    )
}
export default CoursesViews