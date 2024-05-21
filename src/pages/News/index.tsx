/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  DatePickerUI,
  InputUI,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@/components';
import { history, useModel } from '@umijs/max';
import { Button, Col, Form, Row, Table } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './News.scss';

const NewsManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const currentDate = dayjs();
  const tempStartMonth = dayjs().month(currentDate.month()).date(currentDate.date());
  const [startMonth, setStartMonth] = useState<dayjs.Dayjs>(tempStartMonth);

  const handleNavigator = () => {
    history.push(`/news/create`);
  };
  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartMonth(date);
    console.log('date', date);
  };

  /** handle submit */
  const handleSubmit = () => {};

  /** config data */
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '8%',
    },
    {
      title: 'Tiêu đề tin tức',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: 'Ngày đăng tin ',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
    },
    {
      title: 'Phân loại tin tức',
      dataIndex: 'notification',
      key: 'notification',
      width: '42%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]}>
          <Col>
            <PencilIcon />
          </Col>
          <Col>
            <TrashIcon />
          </Col>
        </Row>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  const dataSource = [
    {
      key: '1',
      stt: 1,
      title: 'Thông báo 1',
      date: '2024-05-01',
      notification: 'Tin tức nổi bật',
      action: 'Edit/Delete',
    },
    {
      key: '2',
      stt: 2,
      title: 'Thông báo 2',
      date: '2024-05-02',
      notification: 'Tin tức nổi bật',
      action: 'Edit/Delete',
    },
    {
      key: '3',
      stt: 3,
      title: 'Thông báo 3',
      date: '2024-05-03',
      notification: 'Tin tức nổi bật',
      action: 'Edit/Delete',
    },
  ];

  useEffect(() => {
    form.setFieldValue('date', startMonth);
    setInitialState((s: any) => ({
      ...s,
      data: 'TIN TỨC',
    }));
  }, []);

  return (
    <Row className="news-management_container">
      <Breadcrumb title="Tin Tức" />
      <Container>
        <Form form={form} layout="vertical" className="news-management_form" onFinish={handleSubmit}>
          <Row gutter={[16, 12]}>
            <Col span={5}>
              <Form.Item label="Tiêu đề tin tức" name="title" required={false}>
                <InputUI placeholder="Tiêu đề tin tức" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Tháng/Năm" name="date" required={false}>
                <DatePickerUI
                  allowClear={false}
                  picker="month"
                  value={dayjs(startMonth)}
                  format={'MM/YYYY'}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} onClick={handleNavigator} className="btn btn-add">
                Thêm tin tức
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
        />
      </Container>
    </Row>
  );
};

export default React.memo(NewsManagement);
