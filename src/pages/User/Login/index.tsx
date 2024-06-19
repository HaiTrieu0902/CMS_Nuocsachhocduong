import useLoading from '@/hooks/useLoading';
import { IUser } from '@/models/auth.model';
import { loginAPI } from '@/services/api/auth';
import { rulePassword } from '@/utils/validate';
import { history, useModel } from '@umijs/max';
import { Button, Form, Input, Typography, message } from 'antd';
import React from 'react';
import './Login.scss';

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const { isLoading, withLoading } = useLoading();
  const handleSubmit = async (values: IUser) => {
    await withLoading(async () => {
      try {
        const res = await loginAPI({ ...values, deviceLogin: 'web' });
        if (res) {
          localStorage.setItem('accessToken', res?.data?.token);
          localStorage.setItem('auth', JSON.stringify(res?.data));
          await setInitialState((s: any) => ({
            ...s,
            role: res?.data?.role,
            currentUser: {
              name: res?.data?.fullName,
              avatar: res?.data?.avatar,
            },
          }));
          message.success('Đăng nhập thành công');
          setTimeout(() => {
            history.push('/');
          }, 100);
        }
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  return (
    <div className="container">
      <div className="content">
        <div className="loginContainer">
          <Form
            initialValues={{ remember: false }}
            layout="vertical"
            className="loginForm"
            onFinish={(value: IUser) => handleSubmit(value)}
          >
            <Typography.Title className="formTypo" level={4}>
              Đăng nhập
            </Typography.Title>

            <Typography.Title className="formTitle" level={5}>
              Vui lòng nhập tài khoản và mật khẩu để tiếp tục
            </Typography.Title>
            <Form.Item
              label="Tài khoản"
              name="email"
              required={false}
              rules={[{ required: true, message: 'Tài khoản không được để trống!' }]}
            >
              <Input className="formInput" />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password" required={false} rules={rulePassword}>
              <Input.Password className="formInput" />
            </Form.Item>
            <Form.Item className="formBtnLogin">
              <Button loading={isLoading} className="btn btnLogin mt-16" key="submit" htmlType="submit">
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
