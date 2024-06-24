/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, XCircleIcon } from '@/components';
import { authUser } from '@/constants';
import useLoading from '@/hooks/useLoading';
import { triggerLoadingSchool } from '@/redux/school.slice';
import { createSchoolAPI, updateSChoolAPI } from '@/services/api/school';
import { useAppDispatch } from '@/store';
import { Button, Col, Divider, Form, Modal, Row, Typography, message } from 'antd';
import React, { useEffect } from 'react';
import './AddOrUpdateSchool.scss';

interface AddOrUpdateSchoolProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
}

const AddOrUpdateSchool = ({ isActive, title, data, onCancel }: AddOrUpdateSchoolProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { isLoading, withLoading } = useLoading();

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    await withLoading(async () => {
      try {
        if (data?.id) {
          await updateSChoolAPI({ ...values, isDelete: false, accountId: authUser?.id, id: data?.id });
          message.success('Cập nhật trường học thành công');
        } else {
          await createSchoolAPI({ ...values, isDelete: false, accountId: authUser?.id });
          message.success('Tạo trường học thành công');
        }
        dispatch(triggerLoadingSchool());

        handleCancelModal();
      } catch (error: any) {
        message.error(error?.error || error?.message);
      }
    });
  };

  useEffect(() => {
    if (data?.id) {
      const initialForm = {
        name: data?.name,
        email: data?.email,
        address: data?.address,
        phoneNumber: data?.phoneNumber,
      };
      form.setFieldsValue(initialForm);
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
          {data?.id ? 'Cập nhật trường học' : 'Tạo trường học mới'}
        </Typography.Title>
      }
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-school-management__container"
    >
      <Form form={form} layout="vertical" className="school-management_form" onFinish={handleSubmit}>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Form.Item
              label="Tên trường học :"
              name="name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Tên trường học không được trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập tên trường học" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Email trường học :"
              name="email"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Email trường học không được để trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập email trường học" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Địa chỉ trường học"
              name="address"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Địa chỉ trường học không được để trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập địa chỉ trường học" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Số điện thoại trường học"
              name="phoneNumber"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Số điện thoại trường học không được để trống',
                },
                {
                  pattern: /^[0-9]+$/,
                  message: 'Số điện thoại chỉ được chứa các ký tự số từ 0 đến 9',
                },
              ]}
            >
              <InputUI placeholder="Nhập số điện thoại trường học" />
            </Form.Item>
          </Col>

          <Col span={24} className="mt-24">
            <Button loading={isLoading} icon={<PlusIcon />} htmlType="submit" className="btn btn-primary">
              {data?.id ? 'Cập nhật' : 'Thêm trường học'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateSchool);
