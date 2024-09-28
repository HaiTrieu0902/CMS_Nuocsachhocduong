/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePickerUI, InputUI, SelectUI, SortDescendingIcon, XCircleIcon } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE_MAX } from '@/constants';
import { EROLE_CONVERT } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import { IAccount } from '@/models/account.model';
import { ISchool } from '@/models/school.model';
import { createAccountAPI, getDetailUserAPI, updateAccountAPI } from '@/services/api/account';
import { getListSchoolAPI } from '@/services/api/school';
import { checkKeyCode, emailValidationPattern } from '@/utils/common';
import { Button, Col, DatePickerProps, Divider, Form, Modal, Radio, Row, Typography, message } from 'antd';
import { RadioChangeEvent } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './AddOrUpdateAccount.scss';

interface AddOrUpdateAccountProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
  onSuccess: () => void;
}

const AddOrUpdateAccount = ({ isActive, title, data, onCancel, onSuccess }: AddOrUpdateAccountProps) => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());
  const [value, setValue] = useState(1);
  const [listSchool, setListSchool] = useState<ISchool[]>([]);
  const [selectMode, setSelectMode] = useState<'multiple' | undefined>('multiple');
  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartDate(date);
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);

    setSelectMode(e.target.value === EROLE_CONVERT.STAFF ? 'multiple' : undefined);
    if (e.target.value === EROLE_CONVERT.PRINCIPAL) {
      form.setFieldValue('schoolIds', undefined);
    }
  };

  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
  };

  const handleSubmit = async (values: IAccount) => {
    await withLoading(async () => {
      try {
        const { schoolIds, ...rest } = values;
        const formattedSchool = Array.isArray(schoolIds) ? schoolIds : [schoolIds];
        const params = {
          ...rest,
          schoolIds: formattedSchool,
          avatar: '',
        };

        if (data?.id) {
          const { password, ...rest } = params;
          await updateAccountAPI({ ...rest, id: data?.id });
          message.success('Cập nhật thông tin khoản thành công');
        } else {
          await createAccountAPI(params);
          message.success('Tạo tài khoản thành công');
        }
        onSuccess();
        handleCancelModal();
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** Use Effect */
  useEffect(() => {
    const handleGetListSchool = async () => {
      try {
        const res = await getListSchoolAPI({
          pageSize: DEFAULT_SIZE_PAGE_MAX,
          page: DEFAULT_PAGE_NUMBER,
          isDelete: false,
        });
        setListSchool(res?.data);
      } catch (error: any) {
        message.error(error?.message);
      }
    };
    if (isActive) {
      handleGetListSchool();
    }
  }, [isActive]);

  /** Use Effect */
  useEffect(() => {
    if (data?.id && isActive) {
      const handleGetAccountDetail = async () => {
        try {
          const res = await getDetailUserAPI(data?.id);
          const setInitialForm: IAccount = {
            avatar: '',
            email: res?.data?.email,
            roleId: res?.data?.roleId,
            phoneNumber: res?.data?.phoneNumber,
            fullName: res?.data?.fullName,
            dob: res?.data?.dob ? dayjs(res?.data?.dob) : undefined,
            schoolIds:
              res?.data?.roleId === EROLE_CONVERT.STAFF
                ? res?.data?.schools?.map((item: any) => {
                    return item?.id;
                  })
                : res?.data?.schools[0]?.id,
          };
          setSelectMode(res?.data?.roleId === EROLE_CONVERT.STAFF ? 'multiple' : undefined);
          form?.setFieldsValue(setInitialForm);
        } catch (error: any) {
          message.error(error?.message);
        }
      };
      handleGetAccountDetail();
    }
  }, [isActive]);

  return (
    <Modal
      width={550}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={
        <Typography.Title className="title-header_modal">
          {data?.id ? 'Cập nhật tài khoản' : 'Tạo tài khoản'}
        </Typography.Title>
      }
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-accoutn-management__container"
    >
      <Form
        form={form}
        initialValues={{ roleId: EROLE_CONVERT.STAFF }}
        layout="vertical"
        className="addOrUpdate-management_form"
        onFinish={handleSubmit}
      >
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Form.Item label="Loại tài khoản :" name="roleId" required={false}>
              <Radio.Group onChange={onChange} defaultValue={EROLE_CONVERT.STAFF} value={value}>
                <Radio value={EROLE_CONVERT.STAFF}>
                  <Typography.Text className="title-text-radio_modal">Nhân viên kỹ thuật</Typography.Text>
                </Radio>
                <Radio value={EROLE_CONVERT.PRINCIPAL}>
                  <Typography.Text className="title-text-radio_modal">Nhà trường</Typography.Text>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Chọn trường :"
              name="schoolIds"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Trường học không được trống',
                },
              ]}
            >
              <SelectUI
                className="select_layout-multiplie"
                maxTagCount={'responsive'}
                mode={selectMode}
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
          {!data?.id && (
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
          )}

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
              {data?.id ? 'Cập nhật' : 'Thêm tài khoản'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateAccount);
