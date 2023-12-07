import { Button, Form, Input } from "antd";
import "./Login.scss"
import { auth } from "../../Config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setCookie } from "../../helpers/cookie";
import { useDispatch } from "react-redux";
import { authentication } from "../../Action/auth";
import { useNavigate } from "react-router-dom";
function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleFinish = async (infoInput) => {
        try {
            await signInWithEmailAndPassword(auth, infoInput.email, infoInput.password);
            const time = 1;
            setCookie("id", auth?.currentUser?.uid,time);
            setCookie("email", infoInput.email, time);
            setCookie("token", auth?.currentUser?.accessToken, time);
            dispatch(authentication(true));
            navigate("/")
        }
        catch (err) {
           
        }
    }
    return (
        <>
           
            <div className="login">

                <Form className="login__form"
                    initialValues={{
                        remember: true,
                    }}
                    style={{
                        maxWidth: 300,
                    }}
                    onFinish={handleFinish}
                    
                >
                    <h3>Login</h3>
                    <Form.Item name="email" label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Email!',
                                type: "email"
                            }
                        ]}
                    >
                        <Input placeholder="Email" className="login__form-input" />
                    </Form.Item>

                    <Form.Item name="password" label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            }
                        ]}
                    >
                        <Input.Password placeholder="Password" className="login__form-input" />

                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login__form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </>
    );
}
export default Login;
