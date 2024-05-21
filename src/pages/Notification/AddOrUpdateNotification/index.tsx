/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, DatePickerUI, InputUI, SelectUI, TelegramLogoIcon } from '@/components';
import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
import './AddOrUpdateNotification.scss';
const { TextArea } = Input;

const AddOrUpdateNotification = () => {
  const [form] = Form.useForm();

  const handleSubmit = () => {};

  /* handle actions news */
  const handleAddNewsOrUpdate = async () => {
    await form.validateFields().then(async (formItem) => {
      console.log('formItem', formItem);
    });
  };

  return (
    <Row className="notification__action-management_container">
      <div className="notification__action-header-management">
        <Breadcrumb title="Tạo thông báo" />
        <Row>
          <Button onClick={handleAddNewsOrUpdate} icon={<TelegramLogoIcon />} className="btn btn-add">
            Gửi thông báo
          </Button>
        </Row>
      </div>
      <Form
        style={{ width: '100%' }}
        form={form}
        layout="vertical"
        className="notification__action-management_form mt-16"
        onFinish={handleSubmit}
      >
        <Container>
          <Row gutter={[16, 12]}>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề của thông báo: "
                name="title"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Thông báo không được để trống',
                  },
                ]}
              >
                <InputUI placeholder="Tiêu đề thông báo" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Chọn trường :" name="title" required={false}>
                <SelectUI placeholder="Trường học nhận thông báo" options={[{ value: 1, label: 'THPT NTN' }]} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Tháng/Năm" name="date" required={false}>
                <DatePickerUI
                  placeholder="Chọn ngày sinh"
                  allowClear={false}
                  picker="date"
                  // value={startDate}
                  // format={'DD/MM/YYYY'}
                  // onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Container>

        <Container className="mt-24">
          <div>
            <Form.Item
              label="Nội dung tóm tắt"
              name="summary"
              required={true}
              rules={[
                // {
                //   max: 300,
                //   message: 'Tối đa 300 ký tự',
                // },
                {
                  required: true,
                  message: 'Nội dung không được để trống',
                },
              ]}
            >
              <TextArea
                // showCount
                // maxLength={300}
                placeholder="Nhập nội dung thông báo"
                style={{ height: 128, resize: 'none', width: '100%' }}
              />
            </Form.Item>
          </div>
        </Container>
      </Form>
    </Row>
  );
};

export default React.memo(AddOrUpdateNotification);
