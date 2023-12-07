import { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Table } from "antd";
import * as faceapi from "face-api.js";
import "./WebcamFaceRecognition.scss";
import { getDescripModule, startVideo } from "../../helpers/faceApi";
import { getTrainData } from "../../services/trainData";
import { collection, doc, getDocs, updateDoc, arrayUnion, FieldValue, getDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { useLocation, useParams } from "react-router-dom";
import { getDataTime, getTime } from "../../helpers/dataTime";
function WebcamFaceRecognition() {
    const params = useParams();
    const { id } = params;
    const studentsCollectionRef = collection(db, "students");
    const videoWidth = 350;
    const videoHeight = 265;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    //intervalRef.current cái này dùng để tắt cái hàm setInterval nó sẽ lấy id của hàm đó
    const intervalRef = useRef(null);
    const [load, setLoad] = useState(false);
    //streamOff sẽ lấy stream của camera khi chuyển tab sẽ tắt camera
    const [streamOff, setStreamOff] = useState(null);
    const [descriptors, setDescriptors] = useState([]);
    const [studentsCollection, setStudentsCollection] = useState({});
    const [attendanceData, setAttendanceData] = useState([]);
    var checkId = "";
    useEffect(() => {
        setStreamOff(startVideo(videoRef));
        const fetchApi = async () => {
            const response = await getTrainData();
          
            setDescriptors(await getDescripModule(response));
            setStudentsCollection(await getDocs(studentsCollectionRef));
        };
        fetchApi();
        return async () => {
            //dòng return này sẽ hoạt động khi ta click tab khác lợi dụng điều đó ta đặt mấy cái điều kiện để tắt camera và vài thứ nữa
            if (streamOff !== null) {
                const tracks = streamOff?.getTracks();
                await tracks.forEach((track) => track.stop());
            }
            //Khi chuyển tab hàm Interval sẽ bị tắt ở đây
            clearInterval(intervalRef.current);
        };
    }, []);
    useEffect(() => {
        handleVideoOnPlay();
    }, [studentsCollection]);

    //Hai biến này cho ra ngoài để đỡ chạy trong kia nhiều
    const displaySize = {
        width: videoWidth,
        height: videoHeight,
    };
    canvasRef?.current?.getContext(`2d`).clearRect(0, 0, videoWidth, videoHeight);

    const handleVideoOnPlay = () => {
        intervalRef.current = setInterval(async () => {
            if (load) {
                setLoad(false);
            }
            if (
                videoRef?.current?.readyState === 4 &&
                descriptors.length > 0 &&
                studentsCollection
            ) {
                try {
                    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
                        videoRef.current
                    );

                    const faceMatcher = new faceapi.FaceMatcher(descriptors, 0.54);
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    const detections = await faceapi
                        .detectAllFaces(
                            videoRef.current,
                            new faceapi.TinyFaceDetectorOptions()
                        )
                        .withFaceLandmarks()
                        .withFaceDescriptors();
                    if (detections.length > 0) {
                        const resizeDetections = faceapi.resizeResults(
                            detections,
                            displaySize
                        );

                        faceapi.draw.drawDetections(canvasRef?.current, resizeDetections);
                        const canvas = canvasRef.current;
                        resizeDetections.forEach(async (detection) => {
                            const box = detection.detection.box;
                            //lấy ra dữ liệu description train hợp nhất chuyển qua string
                            const findBestMatch = String(
                                faceMatcher.findBestMatch(detection.descriptor)
                            );
                            //mẫu của json của json server là id1234 (0.43) vậy ta split chuỗi vừa ta lấy được id là [0] còn độ chính xác sẽ là [1]
                            const idFindBestMatch = findBestMatch.split(" ")[0];
                           
                            //đoạn này lấy cái idFind kia so sánh cùng id doc firestore để lấy ra dữ liệu sinh viên đó và gán cho drawBox lúc này biến dataFirestore sẽ chứa full dữ liệu của sinh viên
                            const dataFirestore = studentsCollection.docs
                                .filter(
                                    (dataFilter) => dataFilter.data().id === idFindBestMatch
                                )
                                .map((dataMap) => ({
                                    ...dataMap.data(),
                                }));

                            if ( dataFirestore.length > 0 && checkId !== dataFirestore[0]?.id ) {
                                checkId = dataFirestore[0].id;
                                const objectNew = [
                                    {
                                        idStudent: dataFirestore[0].id,
                                        name: dataFirestore[0].name,
                                        class: dataFirestore[0].class,
                                        time: getTime(),
                                    },
                                ];              
                                //Đoạn này tìm ra ngày và push dữ liệu vào
                                const movieDoc = doc(db, "attendance", id);
                                //getDoc lấy dữ liệu chỉ một movieDoc để mấy bước sau thao tác cho nó update dữ liệu lên firestore
                                const attendanceDoc = await getDoc(movieDoc);
                                //Lấy hết dữ liệu bằng hàm data();
                                const attendanceFullDocData = attendanceDoc.data();
                                //Đoạn này sẽ check index nếu date === trong cơ sở dữ liệu sẽ trả ra index
                                const indexAttendance = attendanceFullDocData?.attendanceData?.findIndex(dataFilter => dataFilter.date === getDataTime())  
                                //Khi Có Index Rồi thì ta push thàng vào attendanceData    
                               attendanceFullDocData?.attendanceData[indexAttendance]?.students?.push(objectNew[0])
                               //push thành công thì ta update lên doc  
                               await updateDoc(movieDoc,attendanceFullDocData)
                               
                                setAttendanceData(objectNew);
                                const drawBox = new faceapi.draw.DrawBox(box, {
                                    label: dataFirestore[0]?.name,
                                    lineWidth: 1,
                                });
                                drawBox.draw(canvas);
                            }
                        });
                    }
                } catch (err) { }
            }
            //Lấy fame id tý xuống kia khi chuyển tab sẽ tắt fame
            let fameId = requestAnimationFrame(setInterval);
            return () => {
                if (fameId) {
                    //Đoạn này khi check thấy chuyển tab nó sẽ không cho cái Frame chạy nữa
                    cancelAnimationFrame(fameId);
                }
            };
        }, 1000);
    };

    const columns = [
        {
            title: "Id Sinh Viên",
            dataIndex: "idStudent",
            key: "idStudent",
            align: "center",
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: "Lớp",
            dataIndex: "class",
            key: "class",
            align: "center",
        },
        {
            title: "Thời Gian Điểm Danh",
            dataIndex: "time",
            key: "time",
            align: "center",
        },
    ];
    return (
        <>
            <p
                onClick={() => {
                    window.location.reload();
                }}
                style={{ textAlign: "center", cursor: "pointer" }}
            >
                {load ? <strong>Load</strong> : <strong>Ready</strong>}
            </p>
            <Card>
                <Row>
                    <Col span={12} className="webcam-container__camera">
                        <canvas className="webcam-container__canvas" ref={canvasRef} />
                        <video
                            className="webcam-container__video"
                            ref={videoRef}
                            autoPlay
                            muted
                            height={videoHeight}
                            width={videoWidth}
                        />
                    </Col>
                    <Col span={12} className="webcam-container__table">
                        <Table
                            dataSource={attendanceData}
                            columns={columns}
                            pagination={false}
                            rowKey="name"
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default WebcamFaceRecognition;
