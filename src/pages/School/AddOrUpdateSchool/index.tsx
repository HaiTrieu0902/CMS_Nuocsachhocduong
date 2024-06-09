/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, XCircleIcon } from '@/components';
import useLoading from '@/hooks/useLoading';
import { triggerLoadingSchool } from '@/redux/school.slice';
import { createSchoolAPI } from '@/services/api/school';
import { useAppDispatch } from '@/store';
import { Button, Col, Divider, Form, Modal, Row, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
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
        const res = await createSchoolAPI({ ...values, dateContract: dayjs() });
        dispatch(triggerLoadingSchool());
        message.success('Tạo trường học thành công');
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
      title={<Typography.Title className="title-header_modal">Nhập dữ liệu trường mới</Typography.Title>}
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
              label="Mã trường học :"
              name="code"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Mã trường học không được trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập mã trường học" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Tên trường học :"
              name="name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Tên trường học không được để trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập tên trường học" />
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

          <Col span={24} className="mt-24">
            <Button loading={isLoading} icon={<PlusIcon />} htmlType="submit" className="btn btn-primary">
              Thêm trường học
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateSchool);
