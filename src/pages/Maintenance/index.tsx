/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PencilIcon, PlusIcon, SearchIcon, SelectUI, TrashIcon } from '@/components';
import useModal from '@/hooks/useModal';
import { Button, Col, Form, Row, Table } from 'antd';
import React, { useEffect } from 'react';

import { useModel } from '@umijs/max';
import AddOrUpdateMaintain from './AddOrUpdateMaintain';
import './Maintain.scss';

const MaintenanceManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const {
    stateModal: editOrAddMaintainState,
    toggleModal: toggleEditOrAddMaintainModal,
    offModal: offEditOrAddMaintainModal,
  } = useModal();
  const handleToggleModal = () => {
    toggleEditOrAddMaintainModal(true, 'add', {})();
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
      title: 'Mã nhân viên',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
    },
    {
      title: 'Tên Nhân Viên',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Ngày/Tháng/Năm',
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

  /* Inittial value for root app */
  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: '30 SỰ CỐ, BẢO DƯỠNG CHƯA ĐƯỢC XỬ LÝ',
    }));
  });

  return (
    <Row className="maintain-management_container">
      <Breadcrumb title="Bảo dưỡng - sửa chữa" />
      <Container>
        <Form form={form} layout="vertical" className="maintain-management_form" onFinish={handleSubmit}>
          <Row gutter={[16, 12]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="title" required={false}>
                <InputUI placeholder="Mã sự cố, bảo dưỡng" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Trạng thái" name="date" required={false}>
                <SelectUI placeholder="Chọn trạng thái" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={3}>
              <Button icon={<PlusIcon />} onClick={handleToggleModal} className="btn btn-add">
                Tạo sự cố
              </Button>
            </Col>
            <Col span={3}>
              <Button icon={<PlusIcon />} onClick={handleToggleModal} className="btn btn-add">
                Bảo dưỡng
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
      <AddOrUpdateMaintain
        onCancel={offEditOrAddMaintainModal}
        isActive={editOrAddMaintainState.open}
        data={editOrAddMaintainState?.data}
      />
    </Row>
  );
};

export default React.memo(MaintenanceManagement);
