import { Button, Form, Input, message } from "antd";
import { auth, db } from "../../Config/Firebase";
import "./Register.scss";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
function Register() {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const usersCollectionRef = collection(db, "users");
    const handleRegister = async (infoUser) => {
        try {
            const newDocRef = doc(usersCollectionRef);
            const objectData = {
                email: infoUser.email,
                name: infoUser.name,
                id: newDocRef.id,
            };
           
            await createUserWithEmailAndPassword(
                auth,
                infoUser.email,
                infoUser.password
            );
            await setDoc(newDocRef, objectData);
            await signOut(auth);
           
            messageApi.open({
                type: "success",
                content: "Đăng Ký Thành Công",
            });
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
           
            messageApi.open({
                type: "warning",
                content: "Email Đã Tồn Tại!",
            });
        }
    };
    return (
        <>
            {contextHolder}
            <div className="register">
                <Form
                    className="register__form"
                    initialValues={{
                        remember: true,
                    }}
                    style={{
                        maxWidth: 300,
                    }}
                    onFinish={handleRegister}
                >
                    <h3>Register</h3>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Name!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tên Giảng Viên"
                            className="register__form-input"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your E-mail!",
                                type: "email",
                            },
                        ]}
                    >
                        <Input
                            placeholder="contact@abc.com"
                            className="register__form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="123456"
                            className="register__form-input"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="register__form-button"
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}
export default Register;
