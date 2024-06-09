/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, DatePickerUI, InputUI, SelectUI, TelegramLogoIcon } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE_MAX } from '@/constants';
import { Ischool } from '@/models/school.model';
import { createNotificationAPI, getDetailNotificationAPI, updateNotificationAPI } from '@/services/api/notification';
import { getListSchoolAPI } from '@/services/api/school';
import { history, useParams } from '@umijs/max';
import { Button, Col, Form, Input, Row, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect, useState } from 'react';
import './AddOrUpdateNotification.scss';
const { TextArea } = Input;
dayjs.extend(customParseFormat);
const format = 'HH:mm';

const AddOrUpdateNotification = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [listSchool, setListSchool] = useState<Ischool[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  /* handle actions news */
  const handleAddNewsOrUpdate = async () => {
    await form.validateFields().then(async (formItems) => {
      const dateFromValue = dayjs(formItems?.date, 'YYYY-MM-DD');
      const timeFromValue = dayjs(formItems?.time, 'H:mm');
      try {
        if (dateFromValue.isValid() && timeFromValue.isValid()) {
          const combinedDateTime = dateFromValue
            .set('hour', timeFromValue.hour())
            .set('minute', timeFromValue.minute());
          const params = {
            title: formItems?.title,
            timeSend: combinedDateTime.toISOString(),
            content: formItems?.content,
            schoolIds: formItems?.schoolIds,
          };
          if (id) {
            await updateNotificationAPI({ ...params, id: id });
            message.success('Cập nhật thông báo thành công');
          } else {
            await createNotificationAPI(params);
            message.success('Tạo thông báo thành công');
          }
          history.push('/notification');
        }
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /* handle school changed */
  const handleSchoolChange = (value: string[]) => {
    if (value.includes('all')) {
      if (value.length === listSchool?.length + 1) {
        setSelectedSchools([]);
        form.setFieldsValue({ schoolIds: [] });
      } else {
        const allSchoolIds = listSchool?.map((school) => school.id) || [];
        setSelectedSchools(allSchoolIds as never);
        form.setFieldsValue({ schoolIds: allSchoolIds });
      }
    } else {
      setSelectedSchools(value);
      form.setFieldsValue({ schoolIds: value });
    }
  };

  /** handle disable date */
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };

  /** handle disable hours */
  const disabledHours = () => {
    if (!selectedDate) return [];
    if (selectedDate.isSame(dayjs(), 'day')) {
      const currentHour = dayjs().hour();
      return [...Array(currentHour).keys()];
    }
    return [];
  };

  /** handle disable disabledMinutes */
  const disabledMinutes = (selectedHour: any) => {
    if (!selectedDate) return [];
    if (selectedDate.isSame(dayjs(), 'day') && selectedHour === dayjs().hour()) {
      const currentMinute = dayjs().minute();
      const nextValidMinute = currentMinute + 10;
      return [...Array(nextValidMinute).keys()];
    }
    return [];
  };

  /** Handle date change */
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    form.setFieldsValue({ time: null });
  };

  /** Use Effect */
  useEffect(() => {
    if (id) {
      const handleGetNotificationtail = async () => {
        try {
          const res = await getDetailNotificationAPI(id);
          const setInitialForm = {
            title: res?.data?.title,
            content: res?.data?.content,
            schoolIds: res?.data?.schools?.map((item: any) => item?.id),
            date: dayjs(res?.data?.timeSend),
            time: dayjs(res?.data?.timeSend),
          };
          form?.setFieldsValue(setInitialForm);
        } catch (error: any) {
          message.error(error?.message);
        }
      };
      handleGetNotificationtail();
    }
  }, [id]);

  useEffect(() => {
    const handleGetListSchool = async () => {
      try {
        const res = await getListSchoolAPI({ size: DEFAULT_SIZE_PAGE_MAX, page: DEFAULT_PAGE_NUMBER });
        setListSchool(res?.data[0]);
      } catch (error: any) {
        message.error(error?.message);
      }
    };

    handleGetListSchool();
  }, []);

  return (
    <Row className="notification__action-management_container">
      <div className="notification__action-header-management">
        <Breadcrumb title={`${id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'}`} />
        <Row>
          <Button onClick={handleAddNewsOrUpdate} icon={<TelegramLogoIcon />} className="btn btn-add">
            {`${id ? 'Sửa thông báo' : 'Gửi thông báo'}`}
          </Button>
        </Row>
      </div>
      <Form
        style={{ width: '100%' }}
        form={form}
        layout="vertical"
        className="notification__action-management_form mt-16"
      >
        <Container>
          <Row gutter={[16, 12]}>
            <Col span={9}>
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
            <Col span={5}>
              <Form.Item label="Chọn trường: " name="schoolIds" required={false}>
                <SelectUI
                  className="select_layout-multiplie"
                  maxTagCount={'responsive'}
                  mode={'multiple'}
                  placeholder="Trường học nhận thông báo"
                  options={[
                    { value: 'all', label: 'Chọn tất cả' },
                    ...(listSchool?.map((item) => {
                      return {
                        value: item?.id,
                        label: item?.name,
                      };
                    }) || []),
                  ]}
                  value={selectedSchools}
                  onChange={handleSchoolChange}
                />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item label="Hẹn ngày gửi:" name="date" required={false}>
                <DatePickerUI
                  placeholder="Chọn ngày hẹn gửi"
                  allowClear={false}
                  picker="date"
                  // value={startDate}
                  // format={'DD/MM/YYYY'}
                  onChange={handleDateChange}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Hẹn giờ gửi:" name="time" required={false}>
                <TimePicker
                  style={{ width: '100%', height: 40 }}
                  format={format}
                  changeOnScroll
                  needConfirm={false}
                  disabledHours={disabledHours}
                  disabledMinutes={disabledMinutes}
                />
              </Form.Item>
            </Col>
          </Row>
        </Container>
        <Container className="mt-24">
          <div>
            <Form.Item
              label="Nội dung tóm tắt"
              name="content"
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
