/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, XCircleIcon } from '@/components';
import { Button, Col, Divider, Form, Modal, Row, Typography } from 'antd';
import React from 'react';
import './AddOrUpdateInstall.scss';

interface AddOrUpdateInstallProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
  onSuccess: () => void;
}

const AddOrUpdateInstall = ({ isActive, title, data, onCancel, onSuccess }: AddOrUpdateInstallProps) => {
  const [form] = Form.useForm();

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
    } catch (error: any) {}
  };

  return (
    <Modal
      width={500}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">Thêm loại hợp đồng</Typography.Title>}
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-category-management__container"
    >
      <Form form={form} layout="vertical" className="addOrUpdate-management_form" onFinish={handleSubmit}>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Form.Item
              label="Nhập mã loại hợp đồng :"
              name="code"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Mã hợp đồng không được để trồng',
                },
              ]}
            >
              <InputUI placeholder="Nhập mã loại hợp đồng " />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nhập loại hợp đồng :"
              name="name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Loại hợp đồng không được để trồng',
                },
              ]}
            >
              <InputUI placeholder="Nhập tên loại hợp đồng " />
            </Form.Item>
          </Col>
          <Col span={24} className="mt-16">
            <Button icon={<PlusIcon />} htmlType="submit" className="btn btn-add">
              Thêm loại hợp đồng mới
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateInstall);
