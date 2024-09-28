/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, XCircleIcon } from '@/components';
import useLoading from '@/hooks/useLoading';
import { checkKeyCode } from '@/utils/common';
import { Button, Col, Divider, Form, Modal, Row, Typography } from 'antd';
import React from 'react';
interface AddInvestProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
}

const ModalAddProductInvest = ({ isActive, title, data, onCancel }: AddInvestProps) => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    await withLoading(async () => {
      try {
        handleCancelModal();
      } catch (error: any) {}
    });
  };

  return (
    <Modal
      width={500}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={
        <Typography.Title className="title-header_modal">
          {data?.id ? 'Cập nhật sản phẩm đầu tư' : 'Thêm sản phẩm mới đầu tư'}
        </Typography.Title>
      }
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-accoutn-management__container"
    >
      <Form form={form} layout="vertical" className="addOrUpdate-management_form" onFinish={handleSubmit}>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>

          <Col span={24}>
            <Form.Item
              label="Mã sản phẩm :"
              name="fullName"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Mã sản phẩm không được trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập mã sản phẩm" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Số lượng máy :"
              name="fullName"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Số lượng máy không được trống',
                },
              ]}
            >
              <InputUI onKeyDown={(e: any) => checkKeyCode(e)} placeholder="Nhập số lượng máy" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Vốn đầu tư:"
              name="phoneNumber"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Vốn đầu tư không được trống',
                },
              ]}
            >
              <InputUI onKeyDown={(e: any) => checkKeyCode(e)} placeholder="Nhập vốn đầu tư" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Button icon={<PlusIcon />} loading={isLoading} htmlType="submit" className="btn btn-primary">
              {data?.id ? 'Cập nhật' : 'Thêm sản phẩm mới'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(ModalAddProductInvest);
