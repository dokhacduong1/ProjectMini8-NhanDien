import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "antd";
import "./FaceRecognitionManagement.scss"
import Link from "antd/es/typography/Link";
import { useNavigate } from "react-router-dom";

function FaceRecognitionManagement() {
    const attendanceCollectionRef = collection(db, "attendance");
    const [attendance, setAttendance] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getDocs(attendanceCollectionRef);
            const fullData = response.docs.filter(dataFilter => dataFilter.data().uidUser === auth?.currentUser?.uid).map(dataMap => dataMap.data());
            setAttendance(fullData)
        }
        fetchApi()
    }, [])
    const handeleClickItem = async(idItem)=>{
        navigate(`/attendance-management/${idItem}`)
    }
    return (
        <>
            {
                attendance.length > 0 && (<>
                <div className="FaceRecognitionManagement">
                    <Row gutter={[20,20]} justify="center">
                        {
                            attendance.map(dataMap=>(
                                <Col onClick ={()=>{handeleClickItem(dataMap.id)}} className="FaceRecognitionManagement__item" key={dataMap.id} span={4}>
                                    <Card className="FaceRecognitionManagement__item-card">
                                        <strong>{dataMap.name} - {dataMap.class}</strong>
                                    </Card>
                                </Col>
                            ))
                        }
                       
                    </Row>
                    </div>
                </>)
            }

        </>
    )
}
export default FaceRecognitionManagement