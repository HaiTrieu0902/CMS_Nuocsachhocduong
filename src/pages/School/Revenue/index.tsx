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
import { Button, Col, Form, Row, Table, Typography } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './Revenue.scss';

const tempStartMonth = dayjs().month(dayjs().month()).date(dayjs().date());
const Revenue = () => {
  const [formCreate] = Form.useForm();
  const [formAction] = Form.useForm();
  const [startMonth, setStartMonth] = useState<dayjs.Dayjs>(tempStartMonth);

  const handleCreateRevenue = () => {};
  const handleActionRevenue = () => {};

  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any) => {
    setStartMonth(date);
    console.log('date', date);
  };

  useEffect(() => {
    formCreate.setFieldValue('date', startMonth);
  }, []);

  /** config data */
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '8%',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
    },
    {
      title: 'Tên Trường học',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Ngày ký hợp đồng',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'category',
      key: 'category',
      width: '20%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]}>
          <Col className="pointer">
            <PencilIcon />
          </Col>
          <Col className="pointer">
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
      stt: '1',
      code: 'NV001',
      name: 'John Doe',
      date: '2024-05-09',
      category: 'Admin',
    },
    {
      key: '2',
      stt: '2',
      code: 'NV002',
      name: 'Jane Smith',
      date: '2024-05-08',
      category: 'Manager',
    },
    {
      key: '3',
      stt: '3',
      code: 'NV003',
      name: 'Alice Johnson',
      date: '2024-05-07',
      category: 'Employee',
    },
  ];

  return (
    <Row className="revenue_school-management_container">
      <Row>
        <Col span={24}>
          <Breadcrumb title="Doanh thu trường học" />
        </Col>

        <Col span={24}>
          <Typography.Title className="sub-revenue_title" level={5}>
            {'Trường THPT Lạc Long Quân'}
          </Typography.Title>
        </Col>
      </Row>

      <Form
        style={{ width: '100%' }}
        form={formCreate}
        layout="vertical"
        className="revenue_action-management_form mt-16 "
        onFinish={handleCreateRevenue}
      >
        <Container>
          <Row gutter={[16, 12]} className="">
            <Col span={6}>
              <Form.Item label="Tháng/Năm" name="date" required={false} className="mb-0">
                <DatePickerUI
                  allowClear={false}
                  picker="month"
                  value={dayjs(startMonth)}
                  format={'MM/YYYY'}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Số học sinh :"
                name="account"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Tên không được trống',
                  },
                ]}
              >
                <InputUI placeholder="Số học sinh trong một tháng" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Giá tiền (10,000/học sinh):"
                name="account"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Tên không được trống',
                  },
                ]}
              >
                <InputUI placeholder="Nhập số tiền" />
              </Form.Item>
            </Col>
            <Col span={6}></Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} htmlType="submit" className="btn btn-add">
                Tạo mới
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>

      <Form
        style={{ width: '100%' }}
        form={formAction}
        layout="vertical"
        className="revenue_action-management_form mt-24"
        onFinish={handleActionRevenue}
      >
        <Container>
          <Row gutter={[16, 12]} className="">
            <Col span={6}>
              <Form.Item label="Tháng/Năm" name="date" required={false} className="mb-0">
                <DatePickerUI
                  allowClear={false}
                  picker="month"
                  value={dayjs(startMonth)}
                  format={'MM/YYYY'}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Số học sinh :"
                name="account"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Tên không được trống',
                  },
                ]}
              >
                <InputUI placeholder="Số học sinh trong một tháng" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Giá tiền (10,000/học sinh):"
                name="account"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Tên không được trống',
                  },
                ]}
              >
                <InputUI placeholder="Nhập số tiền" />
              </Form.Item>
            </Col>
            <Col span={6}></Col>
            <Col span={4}>
              <Button icon={<SearchIcon />} htmlType="submit" className="btn btn-primary">
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>

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

export default Revenue;
