/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, XCircleIcon } from '@/components';
import { addCategoryAPI, updateCategoryAPI } from '@/services/api/category';
import { Button, Col, Divider, Form, Modal, Row, Typography, message } from 'antd';
import React, { useEffect } from 'react';
import './AddOrUpdateCategory.scss';

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
      if (data?.id) {
        await updateCategoryAPI({ ...values, id: data?.id });
        message.success('Cập nhật loại sản phẩm thành công');
      } else {
        await addCategoryAPI({ ...values });
        message.success('Thêm loại sản phẩm thành công');
      }

      handleCancelModal();
      onSuccess();
    } catch (error: any) {
      message.error(error?.errors?.errors[0]?.message || error?.message);
    }
  };

  /** Use Effect */
  useEffect(() => {
    if (data?.id && isActive) {
      const setInitialForm = {
        code: data?.code,
        name: data?.name,
      };
      form?.setFieldsValue(setInitialForm);
    }
  }, [isActive]);

  return (
    <Modal
      width={500}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={
        <Typography.Title className="title-header_modal">
          {data?.id ? 'Cập nhật loại sản phẩm' : 'Thêm loại sản phẩm'}
        </Typography.Title>
      }
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
              label="Mã loại sản phẩm: "
              name="code"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Mã loại sản phẩm không được để trống',
                },
                {
                  max: 255,
                  message: 'Mã lại sản phẩm giới hạn 255 ký tự',
                },
              ]}
            >
              <InputUI placeholder="Nhập mã loại sản phẩm " />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Loại sản phẩm :"
              name="name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Tên loại sản phẩm không được để trống',
                },
                {
                  max: 255,
                  message: 'Tên lại sản phẩm giới hạn 255 ký tự',
                },
              ]}
            >
              <InputUI placeholder="Nhập tên loại sản phẩm " />
            </Form.Item>
          </Col>
          <Col span={24} className="mt-16">
            <Button icon={<PlusIcon />} htmlType="submit" className="btn btn-add">
              {data?.id ? 'Cập nhật' : 'Thêm loại sản phẩm mới'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateCategory);
