/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePickerUI, InputUI, PlusIcon, XCircleIcon } from '@/components';
import useLoading from '@/hooks/useLoading';
import { triggerLoadingSchool } from '@/redux/school.slice';
import { createSchoolAPI } from '@/services/api/school';
import { useAppDispatch } from '@/store';
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
import './AddOrUpdateSchool.scss';
const { TextArea } = Input;
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

  const handleSubmit = async (values: any) => {
    const combinedValues = { ...values, fileData };
    await withLoading(async () => {
      try {
        const res = await createSchoolAPI(values);

        dispatch(triggerLoadingSchool());
        message.success('Tạo trường học thành công');
        handleCancelModal();
      } catch (error: any) {
        message.error(error?.message);
      }
    });
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
              label="Ngày ký hợp đồng"
              name="dateContract"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Ngày ký hợp đồng không được để trống',
                },
              ]}
            >
              <DatePickerUI
                placeholder="Nhập ngày ký hợp đồng"
                allowClear={false}
                picker="date"
                value={startDate}
                format={'DD/MM/YYYY'}
                onChange={handleDateChange}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Upload {...props} style={{ width: '100%' }}>
              <Button style={{ width: '100%' }} className="btn-upload" icon={<UploadOutlined />}>
                Upload hợp đồng đã ký
              </Button>
            </Upload>
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
