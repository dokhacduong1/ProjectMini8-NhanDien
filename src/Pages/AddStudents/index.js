import { Button, Card, DatePicker, Form, Input, Select, Upload, message } from "antd"
import { getDataTime } from "../../helpers/dataTime";
import { UploadOutlined } from '@ant-design/icons';
import { convertImageToBase64 } from "../../helpers/trainData";
import { convertDataToJsonFaceApi } from "../../helpers/faceApi";
import "./AddStudents.scss"
import { postTrainData } from "../../services/trainData";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../Config/Firebase";
import { useEffect, useState } from "react";
function AddStudents() {
    const studentsCollectionRef = collection(db, "students");
    const trainDataCollectionRef = collection(db, "trainData");
    const classCollectionRef = collection(db, "class");
    const [classStudents,setClassStudents] = useState([]);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(()=>{
        const fetchApi = async()=>{
            const response =  await getDocs(classCollectionRef);
            const option =  response.docs.map(dataMap=>({
                value:dataMap.data().name,
                label:dataMap.data().name,
            }));
           
            setClassStudents(option);
        }
        fetchApi()
    },[])
    const handleStudents = async (infoForm) => {
        const newDocRef = doc(studentsCollectionRef);
       //Tạo một tên mới có chứa id ref và tên bên nhận diện sẽ thao tác với id này
        const nameNew = `${newDocRef.id}`
        
        //Hàm này lấy date và convert sao chuẩn date nhất
        const date = getDataTime(infoForm.dateOfBirth);
     
        //Tạo một object tý đẩy lên firestore
        const objectData = {
            name:infoForm.name,
            date: date,
            email:infoForm.email,
            class:infoForm.class,
            sex:infoForm.sex,
            id:newDocRef.id
         };
        
        //hàm này lấy link ảnh tý convert qua base64
        const imageList = infoForm.image.fileList.map((data) => (data.originFileObj));
        //hàm này hàm conver ảnh qua base64
        const base64List = await convertImageToBase64(imageList);
        //hàm này truyền vào 2 tham số để lấy _descriptors và lables tý train và đáp vào json server
        const dataJsonFaceApi = await convertDataToJsonFaceApi(base64List, nameNew);
      

        //Hàm này post lên json-server này chỉ cần đáp data vào
        const response = await postTrainData(dataJsonFaceApi);
        if(response){
            await setDoc(newDocRef, objectData);
           
            messageApi.open({
                type: 'success',
                content: `Thêm Thành Công ${infoForm.name}`,
            });
            form.resetFields();
        }
    }
    const checkSizeImage = (_, value)=>{
        if(value.fileList.length <5){
            return Promise.reject('Vui Lòng Chọn Tối Thiểu 5 Ảnh');
        }
        return Promise.resolve();
    }

    return (
        <>
         {contextHolder}
            <Card className="addStudents">
                <Form
                    form={form}
                    className="addStudents__form"
                    initialValues={{
                        remember: true,
                    }}
                    layout="vertical"
                    onFinish={handleStudents}
                >
                    <h3>Thêm Sinh Viên</h3>
                    <Form.Item
                        label="Tên Sinh Viên"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Tên Sinh Viên!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tên Sinh Viên"
                            className="addStudents__form-input"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Email!",
                                type: "email"
                            },
                        ]}
                    >
                        <Input
                            placeholder="Email"
                            className="addStudents__form-input"
                        />
                    </Form.Item>
                    <Form.Item
                        name="class"
                        label="Lớp Học"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Nhập Tên Lớp Học!",

                            },
                        ]}
                    >
                        <Select
                            className="addStudents__form-input"
                            style={{ width: 120 }}
                           options={classStudents}
                        />
                    </Form.Item>

                    <Form.Item
                        name="sex"
                        label="Giới Tính"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn Giới Tính",
                            },
                        ]}
                    >
                        <Select
                            className="addStudents__form-input"
                            style={{ width: 120 }}
                            options={[
                                { value: 'boy', label: 'Nam' },
                                { value: 'girl', label: 'Nữ' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        label="Ngày Sinh"
                        rules={[
                            {
                                required: true,
                                message: "Vui Lòng Chọn Ngày Sinh",
                            },
                        ]}
                    >

                        <DatePicker  className="addStudents__form-input"/>
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Chọn Ảnh Train Data Tối Đa 5 Ảnh"
                        rules={[
                            {
                                validator:checkSizeImage,
                                required: true,
                            
                            },
                        ]}
                    >

                        <Upload multiple={true}>
                            <Button className="addStudents__form-input" icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="addStudents__form-button"
                        >
                           Thêm Sinh Viên
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}
export default AddStudents