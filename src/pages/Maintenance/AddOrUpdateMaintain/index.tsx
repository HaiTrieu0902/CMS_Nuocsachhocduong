/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, SelectUI, SortDescendingIcon, XCircleIcon } from '@/components';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePickerProps,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  Upload,
  UploadProps,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import './AddOrUpdateMaintain.scss';
const { TextArea } = Input;
interface AddOrUpdateMaintainProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
}

const AddOrUpdateMaintain = ({ isActive, title, data, onCancel }: AddOrUpdateMaintainProps) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());
  const [fileData, setFileData] = useState<any>(null);
  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartDate(date);
    console.log('date', date);
  };

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    console.log('values', values);
  };

  const handleFileChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      setFileData(info.file.response);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const props: UploadProps = {
    // name: 'file',
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange: handleFileChange,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <Modal
      width={550}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">Tạo sự cố / Bảo dưỡng</Typography.Title>}
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-maintain-management__container"
    >
      <Form form={form} layout="vertical" className="addOrUpdate-management_form" onFinish={handleSubmit}>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Form.Item
              label="Trường học :"
              name="account"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Trường học không được trống',
                },
              ]}
            >
              <SelectUI placeholder="Chọn trường học gặp sự cố" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Tiêu đề :"
              name="title"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Tiêu đề không được trống',
                },
              ]}
            >
              <InputUI placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Hiện trạng"
              name="summary"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Hiện trạng không được trống',
                },
                // {
                //   max: 300,
                //   message: 'Tối đa 300 ký tự',
                // },
              ]}
            >
              <TextArea
                // showCount
                // maxLength={300}
                placeholder="Nhập nội dung tóm tắt"
                style={{ height: 144, resize: 'none', width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Nhân viên kỹ thuật :"
              name="account"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Nhân viên kỹ thuật không được để trống',
                },
              ]}
            >
              <SelectUI placeholder="Chọn nhân viên kỹ thuật" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Upload {...props} style={{ width: '100%' }}>
              <Button style={{ width: '100%' }} className="btn-upload" icon={<UploadOutlined />}>
                Upload hợp đồng đã ký
              </Button>
            </Upload>
          </Col>

          <Col span={24} className="mt-16">
            <Button icon={<SortDescendingIcon />} htmlType="submit" className="btn btn-primary">
              Tạo yêu cầu
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateMaintain);
