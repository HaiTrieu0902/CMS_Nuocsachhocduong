/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, SelectUI, SortDescendingIcon, XCircleIcon } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE_MAX, authUser } from '@/constants';
import { ESTATUS } from '@/constants/enum';
import { BASE_URL } from '@/constants/urls';
import useLoading from '@/hooks/useLoading';
import { IAccount } from '@/models/account.model';
import { IInstallRecord } from '@/models/install.model';
import { ISchool } from '@/models/school.model';
import { getListUserBySchoolAPI } from '@/services/api/account';
import { getListInstallAPI } from '@/services/api/install';
import { createMaintenanceAPI, updateMaintenanceAPI } from '@/services/api/maintenance';
import { getListSchoolAPI } from '@/services/api/school';
import {
  allowedFormatsImage,
  handleGetCategoryMaintenance,
  handleGetCategoryMaintenanceId,
  handleImageProcessing,
  onPreviewAllFile,
} from '@/utils/common';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Typography, Upload, UploadProps, message } from 'antd';
import { UploadFile } from 'antd/lib';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
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
  const [listSchool, setListSchool] = useState<ISchool[]>();
  const [listAccount, setListAccount] = useState<IAccount[]>([]);
  const [listInstallRecord, setListInstallRecord] = useState<IInstallRecord[]>([]);
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
        return false;
      }
    },
  };

  /** handle call staff by school */
  const handleGetListStaffBySchool = async (id: string) => {
    const userSchool = await getListUserBySchoolAPI(id);
    setListAccount(userSchool?.data || []);
  };

  const handleGetListInstallRecord = async (id: string, condition?: string) => {
    const res = await getListInstallAPI({
      pageSize: DEFAULT_SIZE_PAGE_MAX,
      page: DEFAULT_PAGE_NUMBER,
      schoolId: id,
      statusId: ESTATUS.COMPLETED,
    });
    setListInstallRecord(res?.data);

    if (condition) {
      const maintain = handleGetCategoryMaintenance(res?.data, condition as string);
      form.setFieldValue('categoryMaintenanceId', maintain);
    }
  };

  /** handle on change school */
  const handleOnChangeSchool = async (e: string, type: string) => {
    if (type === 'school') {
      handleGetListStaffBySchool(e);
      handleGetListInstallRecord(e);
      form.setFieldValue('staffId', undefined);
      form.setFieldValue('installRecordId', undefined);
    } else {
      const maintain = handleGetCategoryMaintenance(listInstallRecord, e);
      form.setFieldValue('categoryMaintenanceId', maintain);
    }
  };

  /** handle submit */
  const handleSubmit = useCallback(
    async (values: any) => {
      await withLoading(async () => {
        try {
          const imageUrls = await handleImageProcessing(fileList);
          const params = {
            categoryMaintenanceId: await handleGetCategoryMaintenanceId(
              listInstallRecord,
              form?.getFieldValue('installRecordId'),
            ),

            installRecordId: values?.installRecordId,
            schoolId: values?.schoolId,
            staffId: values?.staffId,
            statusId: ESTATUS.PENDING,
            title: values?.title,
            reason: values?.reason,
            images_request: imageUrls,
          };
          if (data?.id) {
            await updateMaintenanceAPI({
              ...params,
              id: data?.id,
            });
          } else {
            await createMaintenanceAPI({
              ...params,
              accountId: authUser?.id || '68821b5d-176c-4e2d-a0ca-2cd7d0641d47',
            });
          }
          onSuccess();
          message.success(`${data?.id ? 'Sửa sự cố thành công' : 'Tạo sự cố thành công'}`);
          handleCancelModal();
        } catch (error: any) {
          message.error(error?.message);
        }
      });
    },
    [form?.getFieldValue('installRecordId'), fileList, listInstallRecord],
  );

  console.log('data', data);

  /* Changed file list */
  const onChangeFileList: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const result = newFileList.map((item) => ({ file: item, name: item?.name }));
  };

  /** Use Effect */
  useEffect(() => {
    const handleGetListSchoolAndUSer = async () => {
      try {
        const res = await getListSchoolAPI({ pageSize: DEFAULT_SIZE_PAGE_MAX, page: DEFAULT_PAGE_NUMBER });
        setListSchool(res?.data ? res?.data : []);
      } catch (error: any) {}
    };
    if (isActive) {
      handleGetListSchoolAndUSer();
    }
  }, [isActive]);

  /** Set Initial Form */
  useEffect(() => {
    if (data?.id && isActive) {
      const { school, installRecord, title, reason, staff, images_request, images_response, id, categoryMaintenance } =
        data;
      const initialForm = {
        schoolId: school?.id,
        installRecordId: installRecord?.id,
        categoryMaintenanceId: handleGetCategoryMaintenance(listInstallRecord, installRecord?.id),
        title,
        reason,
        staffId: staff?.id,
      };
      handleGetListStaffBySchool(school?.id);
      handleGetListInstallRecord(school?.id, installRecord?.id);
      form.setFieldsValue(initialForm);
      const allImages = images_response?.length > 0 ? [...images_request, ...images_response] : images_request;
      const fileListData = allImages?.map((item: any) => ({
        uid: item.split('/').pop(),
        name: item.split('/').pop(),
        status: 'hasExits',
        url: `${BASE_URL}/${item}`,
      }));
      setFileList(fileListData);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [data, isActive]);

  return (
    <Modal
      width={700}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={
        <Typography.Title className="title-header_modal">
          {data?.id ? 'Cập nhật sự cố / Bảo dưỡng' : 'Tạo sự cố / Bảo dưỡng'}
        </Typography.Title>
      }
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
              label="Trường học gặp sự cố :"
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
                disabled={
                  data?.status?.id === ESTATUS.COMPLETE ||
                  data?.status?.id === ESTATUS.COMPLETED ||
                  data?.status?.id === ESTATUS.INPROGRESS
                }
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
                onChange={(e) => handleOnChangeSchool(e, 'school')}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Thiết bị đã lắp đặt :"
              name="installRecordId"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Thiết bị đã lắp đặt không được trống',
                },
              ]}
            >
              <SelectUI
                disabled={
                  data?.status?.id === ESTATUS.COMPLETE ||
                  data?.status?.id === ESTATUS.COMPLETED ||
                  data?.status?.id === ESTATUS.INPROGRESS ||
                  !form.getFieldValue('schoolId')
                }
                showSearch
                maxTagCount={'responsive'}
                filterOption={(input: any, option: any) =>
                  (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                }
                filterSort={(optionA: any, optionB: any) =>
                  (optionA?.label?.toLowerCase() ?? '').localeCompare(optionB?.label?.toLowerCase())
                }
                placeholder="Chọn thiết bị đã lắp đặt"
                options={listInstallRecord?.map((item) => {
                  return {
                    value: item?.id,
                    label: `${item?.product?.name} --- Lắp đặt lúc: ${
                      item?.timeInstall ? format(new Date(item?.timeInstall), 'dd/MM/yyyy HH:mm:ss') : 'N/A'
                    } `,
                  };
                })}
                onChange={(e) => handleOnChangeSchool(e, 'install')}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Sự cố :" name="categoryMaintenanceId">
              <SelectUI disabled placeholder="Loại sự cố" options={TYPE_PROBLEM} />
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
                disabled={
                  data?.status?.id === ESTATUS.COMPLETE ||
                  data?.status?.id === ESTATUS.COMPLETED ||
                  data?.status?.id === ESTATUS.INPROGRESS
                }
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
                {
                  max: 200,
                  message: 'Tối đa 200 ký tự',
                },
              ]}
            >
              <TextArea
                disabled={
                  data?.status?.id === ESTATUS.COMPLETE ||
                  data?.status?.id === ESTATUS.COMPLETED ||
                  data?.status?.id === ESTATUS.INPROGRESS
                }
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
              name="staffId"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Nhân viên kỹ thuật không được để trống',
                },
              ]}
            >
              <SelectUI
                disabled={
                  data?.status?.id === ESTATUS.COMPLETE ||
                  data?.status?.id === ESTATUS.COMPLETED ||
                  data?.status?.id === ESTATUS.INPROGRESS ||
                  !form.getFieldValue('schoolId')
                }
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
              disabled={
                data?.status?.id === ESTATUS.COMPLETE ||
                data?.status?.id === ESTATUS.COMPLETED ||
                data?.status?.id === ESTATUS.INPROGRESS
              }
              accept="image/png, image/jpeg"
              listType="picture-card"
              fileList={fileList}
              multiple={true}
              onChange={onChangeFileList}
              onPreview={onPreviewAllFile}
              {...propsUploadListPhoto}
              style={{ width: '100%' }}
            >
              <Button
                disabled={
                  fileList?.length >= 10 ||
                  data?.status?.id === ESTATUS.COMPLETE ||
                  data?.status?.id === ESTATUS.COMPLETED ||
                  data?.status?.id === ESTATUS.INPROGRESS
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
              disabled={
                data?.status?.id === ESTATUS.COMPLETE ||
                data?.status?.id === ESTATUS.COMPLETED ||
                data?.status?.id === ESTATUS.INPROGRESS
              }
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
