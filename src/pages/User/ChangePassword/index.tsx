/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, XCircleIcon } from '@/components';
import { Button, Col, Divider, Form, Modal, Row, Typography, message } from 'antd';

import useLoading from '@/hooks/useLoading';
import { IChangePassword } from '@/models/auth.model';
import { changePasswordAPI } from '@/services/api/auth';
import React from 'react';
import './ChangePassword.scss';
interface ChangePasswordProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
}

const ChangePassword = ({ isActive, title, data, onCancel }: ChangePasswordProps) => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: IChangePassword) => {
    await withLoading(async () => {
      try {
        const params = {
          email: data?.email,
          oldPassword: values?.oldPassword,
          newPassword: values?.confirmPassword ? values?.confirmPassword : '',
        };
        await changePasswordAPI(params);
        message.success('Thay đổi mật khẩu thành công');
        handleCancelModal();
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  return (
    <Modal
      width={500}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">Thay đổi mật khẩu</Typography.Title>}
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-changepassword-management__container"
    >
      <Form form={form} layout="vertical" className="changepassword-management_form" onFinish={handleSubmit}>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Typography.Title className="formTitle" level={5}>
              {data?.fullName}
            </Typography.Title>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Mật khẩu:"
              name="oldPassword"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Mật khẩu không được trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập mật khẩu" type="password" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Mật khẩu mới:"
              name="newPassword"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Nhập lại mật khẩu không được trống',
                },
                {
                  pattern: /^[^-\s]{6,30}$/,
                  message: `Mật khẩu từ 6 ký tự đến 30 ký tự.`,
                },
              ]}
            >
              <InputUI placeholder="Nhập mật khẩu mới" type="password" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nhập lại mật khẩu mới:"
              name="confirmPassword"
              required={true}
              dependencies={['newPassword']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('Mật khẩu mới không được trống'));
                    }
                    if (!/^[^-\s]{6,30}$/.test(value)) {
                      return Promise.reject(new Error('Mật khẩu từ 6 ký tự đến 30 ký tự.'));
                    }
                    if (value !== getFieldValue('newPassword')) {
                      return Promise.reject(new Error('Mật khẩu mới và xác nhận mật khẩu không khớp'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputUI placeholder="Nhập mật khẩu mới" type="password" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Button loading={isLoading} htmlType="submit" className="btn btn-primary">
              Cập nhật
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(ChangePassword);
