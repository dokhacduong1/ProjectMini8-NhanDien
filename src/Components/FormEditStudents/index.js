import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  Modal,
  notification,
} from "antd";

import {  useState } from "react";
import { EditOutlined,UploadOutlined } from "@ant-design/icons";

import { db } from "../../Config/Firebase";
import { doc, updateDoc } from "firebase/firestore";
function FormEditStudents(props) {
  const { record, fetchApiLoad } = props;

  const [isModal, setIsModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const handleShowModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleStudents = async(valueForm)=>{
    const movieDoc = doc(db,"students",record.id);
    try{
        await updateDoc(movieDoc,valueForm);
        fetchApiLoad();
        setIsModalOpen(false);
        api.success({
            message: `Cập Nhật Thành Công`,
            description: (
                <>
                    Bạn Đã Sửa Thành Công Sinh Viên <strong>{valueForm.name}</strong>
                </>
            ),
        });
        form.resetFields();

    }catch{
        api.error({
            message: `Cập Nhật Thất Bại`,
            description: (
                <>
                    Vui Lòng Cập Nhật Lại
                </>
            ),
        })
    }
    
  }
  return (
    <>
      {contextHolder}
      <EditOutlined
        onClick={() => {
          handleShowModal();
        }}
      />
      <Modal
        title="Chỉnh Sửa Student"
        open={isModal}
        onCancel={handleCancel}
        footer={null}
      >
        <Card className="createStudents">
          <Row gutter={20}>
            <Col className="createStudents__form" span={24}>
              {record && (
                <>
                  <Form
                    form={form}
                    className="addStudents__form"
                    rules={{
                      remember: true,
                    }}
                    layout="vertical"
                    onFinish={handleStudents}
                    initialValues={record}
                  >
                    <h3>Sửa Sinh Viên</h3>
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
                          type: "email",
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
                      <Input className="addStudents__form-input" />
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
                          { value: "boy", label: "Nam" },
                          { value: "girl", label: "Nữ" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name="date"
                      label="Ngày Sinh"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Chọn Ngày Sinh",
                        },
                      ]}
                    >
                      <Input className="addStudents__form-input" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="addStudents__form-button"
                      >
                        Sửa Sinh Viên
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}
            </Col>
          </Row>
        </Card>
      </Modal>
    </>
  );
}
export default FormEditStudents;
