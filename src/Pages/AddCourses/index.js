import { Button, Card, Form, Input, InputNumber, Select, message } from "antd"
import "./AddCourses.scss"
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/Firebase";
import { useEffect, useState } from "react";
function AddCourses(){
    const coursesCollectionRef = collection(db, "course");
    const studentsCollectionRef = collection(db, "students");
     const classCollectionRef = collection(db, "class");
    const [messageApi, contextHolder] = message.useMessage();
    const [classStudents,setClassStudents] = useState([]);

    useEffect(()=>{
        const fetchApi = async()=>{
            const responseClass =  await getDocs(classCollectionRef);
           
            const option =  responseClass.docs.map(dataMap=>({
                value:dataMap.data().name,
                label:dataMap.data().name,
            }));
            setClassStudents(option);
        }
        fetchApi()
    },[])
    const handleCourses = async (infoForm) => {
        const responseStudents =  await getDocs(studentsCollectionRef);
        const dataStudentInClass = responseStudents.docs.filter(dataFilter=>(dataFilter.data().class === infoForm.class)).map((dataMap) =>({
            id:dataMap.data().id,
            name:dataMap.data().name,
        }));
       
        const newDocRef = doc(coursesCollectionRef);
       const uidUser = auth?.currentUser?.uid;
       const objectNew = {
        ...infoForm,
        uidUser:uidUser,
        id:newDocRef.id,
        listStudents:dataStudentInClass
       }
      
       try{
            await setDoc(newDocRef, objectNew);
            messageApi.open({
                type: 'success',
                content: `Thêm Thành Công ${infoForm.name}`,
            });
       }catch{
            
            messageApi.open({
                type: 'error',
                content: `Vui Lòng Thêm Lại`,
            });
       }
     
      
    }
   

    return (
        <>
         {contextHolder}
            <Card className="addCourses">
                <Form
                    className="addCourses__form"
                    initialValues={{
                        remember: true,
                    }}
                    layout="vertical"
                    onFinish={handleCourses}
                >
                    <h3>Thêm Khóa Học</h3>
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
                            placeholder="Tên Khóa Học"
                            className="addCourses__form-input"
                        />
                    </Form.Item>
                    <Form.Item
                        name="class"
                        label="Lớp Học"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn Tên Lớp Học!",

                            },
                        ]}
                    >
                        <Select
                            className="addCourses__form-input"
                            style={{ width: 120 }}
                           options={classStudents}
                        />
                    </Form.Item>

                    <Form.Item
                        name="totalClassPeriods"
                        label="Tổng Số Tiết Học"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Số Tiết!",

                            },
                        ]}
                    >
                        <InputNumber className="addCourses__form-input" min={1} max={100} />
                    </Form.Item>
                  
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="addCourses__form-button"
                        >
                           Thêm Khóa Học
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}
export default AddCourses