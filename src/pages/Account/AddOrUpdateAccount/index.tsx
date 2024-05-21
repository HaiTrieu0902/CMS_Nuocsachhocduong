/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePickerUI, InputUI, SelectUI, SortDescendingIcon, XCircleIcon } from '@/components';
import { ETYPE_ACCOUNT } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import { IAccount } from '@/models/account.model';
import { createAccountAPI } from '@/services/api/account';
import { checkKeyCode, emailValidationPattern } from '@/utils/common';
import { Button, Col, DatePickerProps, Divider, Form, Modal, Radio, Row, Typography, message } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import './AddOrUpdateAccount.scss';

interface AddOrUpdateAccountProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
}

const AddOrUpdateAccount = ({ isActive, title, data, onCancel }: AddOrUpdateAccountProps) => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());
  const [value, setValue] = useState(1);

  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartDate(date);
    console.log('date', date);
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: IAccount) => {
    await withLoading(async () => {
      try {
        const { school, ...rest } = values;
        const params = {
          ...rest,
          avatar:
            'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/11/gojo-satoru.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5',
        };
        const res = await createAccountAPI(params);
        message.success('Tạo tài khoản thành công');
        handleCancelModal();
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  return (
    <Modal
      width={550}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">Tạo tài khoản</Typography.Title>}
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
            <Form.Item label="Loại tài khoản :" name="role" required={false}>
              <Radio.Group onChange={onChange} defaultValue={ETYPE_ACCOUNT.STAFF} value={value}>
                <Radio value={ETYPE_ACCOUNT.STAFF}>
                  <Typography.Text className="title-text-radio_modal">Nhân viên kỹ thuật</Typography.Text>
                </Radio>
                <Radio value={ETYPE_ACCOUNT.PRINCIPAL}>
                  <Typography.Text className="title-text-radio_modal">Nhà trường</Typography.Text>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Chọn trường :"
              name="school"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Trường học không được trống',
                },
              ]}
            >
              <SelectUI placeholder="Chọn trường học phụ trách" options={[{ value: 1, label: 'THPT NTN' }]} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Họ và tên :"
              name="fullName"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Họ và tên không được trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nhập email:"
              name="email"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Email không được trống',
                },
                {
                  pattern: emailValidationPattern,
                  message: 'Email không hợp lệ',
                },
              ]}
            >
              <InputUI placeholder="Nhập email" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nhập số điện thoại:"
              name="phoneNumber"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Số điện thoại không được trống',
                },
              ]}
            >
              <InputUI onKeyDown={(e: any) => checkKeyCode(e)} placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Nhập mật khẩu:"
              name="password"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Mật khẩu không được trống',
                },
              ]}
            >
              <InputUI type="password" placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Ngày sinh" name="dob" required={false}>
              <DatePickerUI
                placeholder="Chọn ngày sinh"
                allowClear={false}
                picker="date"
                value={startDate}
                format={'DD/MM/YYYY'}
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button icon={<SortDescendingIcon />} loading={isLoading} htmlType="submit" className="btn btn-primary">
              Thêm tài khoản
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateAccount);
