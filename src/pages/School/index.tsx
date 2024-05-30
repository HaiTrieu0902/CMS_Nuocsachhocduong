/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  CurrencyDollarIcon,
  InputUI,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IGetQuerySchool, IListSchool, Ischool } from '@/models/school.model';
import { getListSchoolAPI } from '@/services/api/school';
import { useAppSelector } from '@/store';
import { history, useModel } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { TableParams } from '../../models/common.model';
import AddOrUpdateSchool from './AddOrUpdateSchool';
import './School.scss';

const SchoolManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const { isLoadingListSchool } = useAppSelector((state) => state.school);
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddSchoolState,
    toggleModal: toggleEditOrAddSchoolModal,
    offModal: offEditOrAddSchoolModal,
  } = useModal();
  const [listSchool, setListSchool] = useState<IListSchool>({} as IListSchool);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });

  /** handle toggle modal  */
  const handleToggleModal = () => {
    toggleEditOrAddSchoolModal(true, 'add', {})();
  };

  /** handle get list school */
  const handleGetListSchool = async (values: IGetQuerySchool) => {
    await withLoading(async () => {
      try {
        const res = await getListSchoolAPI(values);
        setListSchool(res);

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
  /** handle submit */
  const handleSubmitSearch = (values: any) => {
    console.log('values', values);
  };

  /** handle submit */
  const handleNavigate = () => {
    history.push(`/school/revenue`);
  };

  const handleTableChange = (pagination: any) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  /** config data */
  const columns: TableColumnsType<Ischool> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={(index + 1).toString()} />;
      },
    },
    {
      title: 'Mã trường học',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.code} content={row?.code} />;
      },
    },
    {
      title: 'Tên Trường học',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text, row) => {
        return <TooltipCell title={row?.name} content={row?.name} />;
      },
    },
    {
      title: 'Ngày ký hợp đồng',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.dateContract} content={row?.dateContract} isDate />;
      },
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
          <Col className="pointer" onClick={handleNavigate}>
            <CurrencyDollarIcon />
          </Col>
        </Row>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  /** EFFECT */
  useEffect(() => {
    handleGetListSchool({
      size: tableParams?.pagination?.pageSize as number,
      page: tableParams?.pagination?.current as number,
    });
  }, [isLoadingListSchool, tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: 'TRƯỜNG HỌC',
    }));
  }, []);
  return (
    <Row className="school-management_container">
      <Breadcrumb title="Quản lý trường học" />
      <Container>
        <Form form={form} layout="vertical" className="school-management_form -mb-18" onFinish={handleSubmitSearch}>
          <Row gutter={[16, 12]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="code" required={false}>
                <InputUI placeholder="Nhập mã trường học" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Tên trường học" name="name" required={false}>
                <InputUI placeholder="Nhập tên trường học" />
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
              <Button icon={<PlusIcon />} onClick={handleToggleModal} className="btn btn-add">
                Tạo mới
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          dataSource={listSchool?.data?.length > 0 ? (listSchool?.data[0] as never) : []}
          columns={columns}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          rowKey={(record) => record.code}
          // showSorterTooltip={false}
          loading={isLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Container>

      <AddOrUpdateSchool
        onCancel={offEditOrAddSchoolModal}
        isActive={editOrAddSchoolState.open}
        data={editOrAddSchoolState?.data}
      />
    </Row>
  );
};

export default React.memo(SchoolManagement);
