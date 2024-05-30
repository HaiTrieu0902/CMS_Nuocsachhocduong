/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, SelectUI, SortDescendingIcon, XCircleIcon } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE_MAX } from '@/constants';
import { EMaintenanceStatus } from '@/constants/enum';
import { BASE_URL } from '@/constants/urls';
import useLoading from '@/hooks/useLoading';
import { IAccount } from '@/models/account.model';
import { Ischool } from '@/models/school.model';
import { getListUserAPI } from '@/services/api/account';
import { createMaintenanceAPI, updateMaintenanceAPI } from '@/services/api/maintenance';
import { getListSchoolAPI } from '@/services/api/school';
import { allowedFormatsImage, handleImageProcessing, onPreviewAllFile } from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Typography, Upload, UploadProps, message } from 'antd';
import { UploadFile } from 'antd/lib';
import React, { useEffect, useState } from 'react';
import { TYPE_PROBLEM } from './../../../constants/index';
import './AddOrUpdateMaintain.scss';
const { TextArea } = Input;
interface AddOrUpdateMaintainProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
  onSuccess: () => void;
}

const AddOrUpdateMaintain = ({ isActive, title, data, onCancel, onSuccess }: AddOrUpdateMaintainProps) => {
  const [form] = Form.useForm();
  const [listSchool, setListSchool] = useState<Ischool[]>();
  const [listAccount, setListAccount] = useState<IAccount[]>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { isLoading, withLoading } = useLoading();

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  /* Props upload file list */
  const propsUploadListPhoto: UploadProps = {
    beforeUpload: (file: any) => {
      const isAllowed = allowedFormatsImage.includes(file.type);
      if (!isAllowed) {
        message.error('Bạn chỉ upload được file PNG, JPEG, or JPG file!');
      } else if (file?.size / 1024 / 1024 > 5) {
        message.error('Ảnh không lớn quá 5mb!');
      } else {
        form.setFieldsValue({ thumbnail: file?.name });
        return isAllowed;
      }
    },
  };

  console.log('data', data);
  const handleSubmit = async (values: any) => {
    await withLoading(async () => {
      try {
        const imageUrls = await handleImageProcessing(fileList);
        console.log('imageUrls', imageUrls);
        if (data?.id) {
          const res = await updateMaintenanceAPI({
            ...values,
            images: imageUrls,
            id: data?.id,
          });
        } else {
          const res = await createMaintenanceAPI({ ...values, images: imageUrls });
        }
        onSuccess();
        message.success(`${data?.id ? 'Sửa sự cố thành công' : 'Tạo sự cố thành công'}`);
        handleCancelModal();
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /* Changed file list */
  const onChangeFileList: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const result = newFileList.map((item) => ({ file: item, name: item?.name }));
  };

  /** Use Effect */
  useEffect(() => {
    const handleGetListSchoolAndUSer = async () => {
      try {
        const res = await getListSchoolAPI({ size: DEFAULT_SIZE_PAGE_MAX, page: DEFAULT_PAGE_NUMBER });
        const resUser = await getListUserAPI({ size: DEFAULT_SIZE_PAGE_MAX, page: DEFAULT_PAGE_NUMBER, role: 'Staff' });
        setListSchool(res?.data[0]);
        setListAccount(resUser?.data[0]);
      } catch (error: any) {}
    };
    if (isActive) {
      handleGetListSchoolAndUSer();
    }
  }, [isActive]);

  /** Set Initial Form */
  useEffect(() => {
    if (data?.id) {
      const parts = data?.code?.split('-');
      const firstPart = parts[0];

      const initialForm = {
        schoolId: data?.schoolId,
        type: firstPart,
        title: data?.title,
        reason: data?.reason,
        assignedTo: data?.assignedTo,
      };
      form.setFieldsValue(initialForm);
      const fileListData = data?.images.map((item: any) => ({
        uid: item.id,
        name: item.url.split('/').pop(),
        status: 'hasExits',
        url: `${BASE_URL}${item.url}`,
      }));
      setFileList(fileListData);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [data, isActive]);

  return (
    <Modal
      width={500}
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
        <Row style={{ maxHeight: 550, overflow: 'auto' }} gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Form.Item
              label="Trường học :"
              name="schoolId"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Trường học không được trống',
                },
              ]}
            >
              <SelectUI
                disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
                showSearch
                maxTagCount={'responsive'}
                filterOption={(input: any, option: any) =>
                  (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label?.toLowerCase() ?? '').localeCompare(optionB?.label?.toLowerCase())
                }
                placeholder="Chọn trường học phụ trách"
                options={listSchool?.map((item) => {
                  return {
                    value: item?.id,
                    label: item?.name,
                  };
                })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Sự cố :"
              name="type"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Sự cố không được trống',
                },
              ]}
            >
              <SelectUI
                disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
                placeholder="Chọn trường học phụ trách"
                options={TYPE_PROBLEM}
              />
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
              <InputUI
                disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
                placeholder="Nhập tiêu đề"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Hiện trạng"
              name="reason"
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
                disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
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
              name="assignedTo"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Nhân viên kỹ thuật không được để trống',
                },
              ]}
            >
              <SelectUI
                disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
                showSearch
                maxTagCount={'responsive'}
                filterOption={(input: any, option: any) =>
                  (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label?.toLowerCase() ?? '').localeCompare(optionB?.label?.toLowerCase())
                }
                placeholder="Chọn nhân viên kỹ thuật"
                options={listAccount?.map((item) => {
                  return {
                    value: item?.id,
                    label: item?.fullName,
                  };
                })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Upload
              disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
              accept="image/png, image/jpeg"
              listType="picture-card"
              fileList={fileList}
              onChange={onChangeFileList}
              onPreview={onPreviewAllFile}
              {...propsUploadListPhoto}
              style={{ width: '100%' }}
            >
              <Button
                disabled={
                  fileList?.length >= 10 ||
                  data?.status === EMaintenanceStatus.COMPLETE ||
                  data?.status === EMaintenanceStatus.COMPLETED
                }
                style={{ width: '100%' }}
                className="btn-upload"
                icon={<UploadOutlined />}
              >
                {fileList?.length < 10 ? 'Upload hình ảnh đính kèm' : 'Bạn không được up nữa'}
              </Button>
            </Upload>
          </Col>
        </Row>

        <Row>
          <Col span={24} className="mt-16">
            <Button
              disabled={data?.status === EMaintenanceStatus.COMPLETE || data?.status === EMaintenanceStatus.COMPLETED}
              loading={isLoading}
              icon={<SortDescendingIcon />}
              htmlType="submit"
              className="btn btn-primary"
            >
              {data?.id ? 'Cập nhật' : 'Tạo yêu cầu'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateMaintain);
