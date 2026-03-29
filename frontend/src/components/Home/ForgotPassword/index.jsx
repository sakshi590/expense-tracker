import { Button, Card, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const { Item } = Form;
import { useNavigate } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import http from "../../../utils/http";
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [forgotForm] = Form.useForm();
  const [rePasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const tok = params.get("token");
    if (tok) {
      checkToken(tok);
    } else {
      setToken(null);
    }
  }, [params]);
  const checkToken = async (tok) => {
    try {
      await http.post(
        "/api/user/verify-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        },
      );
      setToken(tok);
    } catch (err) {
      setToken(null);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await http.post("api/user/forgot-password", values);

      // CHANGE 1: Remove the role checks (admin/user) because this isn't a login
      // CHANGE 2: Use the message from the backend instead of hardcoded "Login Success"
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      if(values.password!== values.rePassword)
      {
        return toast.warning("Password and repassword not matched")
      }
      setLoading(true);
      await http.put("api/user/change-password", values, {
        headers: {
          Authorization: `Bearer ${params.get('token')}`,
        },
      });
      toast.success("Password updated successfully,Please wait...");
      setTimeout(()=>{
        navigate("/")
      },3000)
    } catch (err) {
      toast.error(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Homelayout>
      <div className="flex min-h-screen">
        {/* Left Image */}
        <div className="w-1/2 hidden md:flex items-center justify-center">
          <img src="/exp-img.jpg" alt="Bank" className="w-4/5 object-contain" />
        </div>

        {/* Right Login */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
          <Card className="w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
              {token ? "Change Password" : "Forgot Password"}
            </h2>
            {token ? (
              <Form
                name="login-form"
                layout="vertical"
                onFinish={onChangePassword}
                form={rePasswordForm}
              >
                <Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                  />
                </Item>
                <Item
                  name="rePassword"
                  label="Re Enter Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                  />
                </Item>
                <Item>
                  <Button
                    type="text"
                    htmlType="submit"
                    className="!bg-[#FF735C] !text-white !font-bold"
                    block
                    loading={loading}
                  >
                    Change Password
                  </Button>
                </Item>
              </Form>
            ) : (
              <Form
                name="login-form"
                layout="vertical"
                onFinish={onFinish}
                form={forgotForm}
              >
                <Item name="email" label="Email" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Enter email" />
                </Item>
                <Item>
                  <Button
                    type="text"
                    htmlType="submit"
                    className="!bg-[#FF735C] !text-white !font-bold"
                    block
                    loading={loading}
                  >
                    Submit
                  </Button>
                </Item>
              </Form>
            )}

            <div className="flex items-center justify-between">
              <Link
                style={{ textDecoration: "underline" }}
                to="/"
                className="!text-[#FF735C] !font-bold"
              >
                Sign in
              </Link>
              <Link
                style={{ textDecoration: "underline" }}
                to="/signup"
                className="!text-[#FF735C] !font-bold"
              >
                {" "}
                Don't have an account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Homelayout>
  );
};
