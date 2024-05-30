/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  InputUI,
  ListSmallIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IDataCommon, IGetListParamCommon, TableParams } from '@/models/common.model';
import { getListCategoryAPI } from '@/services/api/category';
import { useModel } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddOrUpdateContract from './AddOrUpdateContract';
import './Contract.scss';

const ContractManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddContractState,
    toggleModal: toggleEditOrAddContractModal,
    offModal: offEditOrAddContractModal,
  } = useModal();
  const [listCategory, setListCategory] = useState<IDataCommon[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });

  /** handle ToggleModal */
  const handleToggleModal = () => {
    toggleEditOrAddContractModal(true, 'add', {})();
  };

  /** handle submit */
  const handleSubmit = () => {};

  /** handle Table Change */
  const handleTableChange = (pagination: any) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  /** handle get list product */
  const handleGetListCategory = async (values: IGetListParamCommon) => {
    await withLoading(async () => {
      try {
        const res = await getListCategoryAPI(values);
        setListCategory(res?.data[0]);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.data[1],
          },
        });
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** config data */
  const columns: TableColumnsType<IDataCommon> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={(index + 1).toString()} />;
      },
    },
    {
      title: 'Mã loại hợp đồng',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.id} content={row?.id} />;
      },
    },
    {
      title: 'Phân loại hợp đồng',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.name} content={row?.name} />;
      },
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
          <Col>
            <ListSmallIcon />
          </Col>
        </Row>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  /* Inittial value for root app */
  useEffect(() => {
    handleGetListCategory({
      size: tableParams?.pagination?.pageSize as number,
      page: tableParams?.pagination?.current as number,
    });
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: 'TÊN LOẠI HỢP ĐỒNG',
    }));
  });

  return (
    <Row className="contract-management_container">
      <Breadcrumb title="Loại hợp đồng" />
      <Container>
        <Form form={form} layout="vertical" className="contract-management_form" onFinish={handleSubmit}>
          <Row gutter={[10, 0]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="title" required={false}>
                <InputUI placeholder="Mã hoặc tên loại hợp đồng" />
              </Form.Item>
            </Col>
            <Col span={18}></Col>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} onClick={handleToggleModal} className="btn btn-add">
                Thêm loại hợp đồng
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          loading={isLoading}
          dataSource={listCategory ? (listCategory as never) : []}
          columns={columns}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
          onChange={handleTableChange}
          pagination={tableParams.pagination}
        />
      </Container>
      <AddOrUpdateContract
        onCancel={offEditOrAddContractModal}
        isActive={editOrAddContractState.open}
        data={editOrAddContractState?.data}
        onSuccess={() =>
          handleGetListCategory({
            size: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(ContractManagement);
