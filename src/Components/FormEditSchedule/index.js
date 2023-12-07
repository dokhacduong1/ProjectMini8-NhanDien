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
    InputNumber,
  } from "antd";
  
  import {  useState } from "react";
  import { EditOutlined } from "@ant-design/icons";
  
  import { db } from "../../Config/Firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import "./FormEditSchedule.scss"
  function FormEditSchedule(props) {
    const { record, fetchApiLoad } = props;
  
    const [isModal, setIsModalOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const { Option } = Select;
    const handleShowModal = () => {
      form.resetFields();
      setIsModalOpen(true);
    };
  
    const handleCancel = () => {
      form.resetFields();
      setIsModalOpen(false);
    };
    const handleStudents = async(valueForm)=>{
        
      const movieDoc = doc(db,"schedule",record.id);
      try{
          await updateDoc(movieDoc,valueForm);
          fetchApiLoad();
          setIsModalOpen(false);
          api.success({
              message: `Cập Nhật Thành Công`,
              description: (
                  <>
                      Bạn Đã Sửa Thành Công 
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
          <Card className="formEditSchedule">
            <Row gutter={20}>
              <Col className="formEditSchedule__form" span={24}>
                {record && (
                  <>
                    <Form
                      form={form}
                      className="formEditSchedule__form"
                      rules={{
                        remember: true,
                      }}
                      layout="vertical"
                      onFinish={handleStudents}
                      initialValues={record}
                    >
                      <h3>Sửa Sinh Viên</h3>
                      <Form.Item
                        label="Số Tiết Học"
                        name="NumberOfPeriods"
                        rules={[
                          {
                            required: true,
                            message: "Vui Lòng Nhập Số Tiết Học!",
                          },
                        ]}
                      >
                         <InputNumber className="formEditSchedule__form-input" min={1} max={10} />
                      </Form.Item>
                     
                    
  
                      <Form.Item
                        name="weekday"
                        label="Ngày Dạy"
                        rules={[
                          {
                            required: true,
                            message: "Vui Lòng Chọn Giới Tính",
                          },
                        ]}
                      >
                        <Select
                            className="formEditSchedule__form-input"
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
                   
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="formEditSchedule__form-button"
                        >
                          Sửa Lịch Học
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
  export default FormEditSchedule;
  