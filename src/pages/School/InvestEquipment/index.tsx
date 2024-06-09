/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, PencilIcon, PlusIcon, TrashIcon } from '@/components';
import useModal from '@/hooks/useModal';
import { Button, Col, Row, Table } from 'antd';
import '../School.scss';
import ModalAddProductInvest from '../components/ModalAddProductInvest';
const InvestEquipmentSchool = () => {
  const {
    stateModal: editOrAddInvestState,
    toggleModal: toggleEditOrAddInvestModal,
    offModal: offEditOrAddInvestModal,
  } = useModal();

  /** config data */
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '8%',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'notification',
      key: 'notification',
      width: '16%',
    },
    {
      title: 'Số lượng máy',
      dataIndex: 'notification',
      key: 'notification',
      width: '16%',
    },

    {
      title: 'Số lần sửa chữa',
      dataIndex: 'notification',
      key: 'notification',
      width: '16%',
    },
    {
      title: 'Vốn đầu tư( VNĐ)',
      dataIndex: 'notification',
      key: 'notification',
      width: '16%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]} justify={'center'}>
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
      notification: 'Tất cả',
      action: 'Edit/Delete',
    },
    {
      key: '2',
      stt: 2,
      title: 'Thông báo 2',
      date: '2024-05-02',
      notification: 'Tất cả',
      action: 'Edit/Delete',
    },
    {
      key: '3',
      stt: 3,
      title: 'Thông báo 3',
      date: '2024-05-03',
      notification: 'Tất cả',
      action: 'Edit/Delete',
    },
    {
      key: '3',
      stt: 3,
      title: 'Thông báo 3',
      date: '2024-05-03',
      notification: 'Tất cả',
      action: 'Edit/Delete',
    },
    {
      key: '3',
      stt: 3,
      title: 'Thông báo 3',
      date: '2024-05-03',
      notification: 'Tất cả',
      action: 'Edit/Delete',
    },
  ];
  return (
    <Row className="invest-management_container">
      <div className="invest-header-management">
        <Breadcrumb title={'Danh sách thiết bị đã đầu tư'} />
        <Row>
          <Button
            //   loading={isLoading} onClick={handleAddNewsOrUpdate}
            icon={<PlusIcon />}
            onClick={toggleEditOrAddInvestModal(true, 'add', {})}
            className="btn btn-add"
          >
            Thêm sản phẩm
          </Button>
        </Row>
      </div>
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
      <ModalAddProductInvest
        onCancel={offEditOrAddInvestModal}
        isActive={editOrAddInvestState.open}
        data={editOrAddInvestState?.data}
      />
    </Row>
  );
};

export default InvestEquipmentSchool;
