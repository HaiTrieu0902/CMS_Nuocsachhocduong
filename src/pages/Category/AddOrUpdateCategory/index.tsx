/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, XCircleIcon } from '@/components';
import { addCategoryAPI } from '@/services/api/category';
import { Button, Col, Divider, Form, Input, Modal, Row, Typography, message } from 'antd';
import React from 'react';
import './AddOrUpdateCategory.scss';
const { TextArea } = Input;
interface AddOrUpdateCategoryProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
  onSuccess: () => void;
}

const AddOrUpdateCategory = ({ isActive, title, data, onCancel, onSuccess }: AddOrUpdateCategoryProps) => {
  const [form] = Form.useForm();

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      await addCategoryAPI({ name: values?.name });
      handleCancelModal();
      onSuccess();
      message.success('Thêm loại sản phẩm thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  return (
    <Modal
      width={500}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">Thêm loại sản phẩm</Typography.Title>}
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
              label="Nhập mã loại sản phẩm :"
              name="code"
              required={false}
              rules={[
                {
                  required: false,
                  message: 'Mã sản phẩm không được để trồng',
                },
              ]}
            >
              <InputUI placeholder="Nhập mã loại sản phẩm " />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nhập loại sản phẩm :"
              name="name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Loại sản phẩm không được để trồng',
                },
              ]}
            >
              <InputUI placeholder="Nhập tên loại sản phẩm " />
            </Form.Item>
          </Col>
          <Col span={24} className="mt-16">
            <Button icon={<PlusIcon />} htmlType="submit" className="btn btn-add">
              Thêm loại sản phẩm mới
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateCategory);
