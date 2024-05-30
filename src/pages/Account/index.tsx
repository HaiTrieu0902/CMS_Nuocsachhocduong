/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  InputUI,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SelectUI,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, TYPES_ACCOUNT_ALL, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IAccount, IGetListParamsUser, IListUser } from '@/models/account.model';
import { TableParams } from '@/models/common.model';
import { getListUserAPI } from '@/services/api/account';
import { getRoleDescription } from '@/utils/common';
import { useModel } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './Account.scss';
import AddOrUpdateAccount from './AddOrUpdateAccount';

const AccountManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddAccountState,
    toggleModal: toggleEditOrAddAccountModal,
    offModal: offEditOrAddAccountModal,
  } = useModal();
  const [listUser, setListUser] = useState<IListUser>({} as IListUser);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });

  const [searchParams, setSearchParams] = useState<IGetListParamsUser>({
    size: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
    role: '',
  });

  const handleToggleModal = () => {
    toggleEditOrAddAccountModal(true, 'add', {})();
  };

  /** handle get list product */
  const handleGetListUser = async (values: IGetListParamsUser) => {
    await withLoading(async () => {
      try {
        const res = await getListUserAPI(values);
        setListUser(res);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: values.page,
            total: res.data[1],
          },
        });
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** handle submit */
  const handleSubmitSearchAccount = async (values: any) => {
    setSearchParams({
      size: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
      role: values?.role || '',
    });
  };

  /** handle Table Change */
  const handleTableChange = (pagination: any) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: pagination.current,
      size: pagination.pageSize,
    }));
  };

  /** config data */
  const columns: TableColumnsType<IAccount> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={`${(index + 1).toString()}`} />;
      },
    },
    {
      title: 'Tài khoản',
      key: 'code',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={row?.email ? row?.email : String(row?.phoneNumber)}
            content={row?.email ? row?.email : String(row?.phoneNumber)}
          />
        );
      },
    },
    {
      title: 'Họ và tên',
      key: 'name',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.fullName} content={row?.fullName} />;
      },
    },

    {
      title: 'Trường phụ trách',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
      render: (text, row) => {
        return (
          <Row>
            {row?.schools?.map((item) => {
              return (
                <Col key={item?.id} span={24}>
                  <Typography.Text key={item?.id} className="text_cell">
                    {item?.name || ''}
                  </Typography.Text>
                </Col>
              );
            })}
          </Row>
        );
      },
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      render: (text, row) => {
        return <TooltipCell title={getRoleDescription(row?.role)} content={getRoleDescription(row?.role)} />;
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
        </Row>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  /** Use Effect */
  useEffect(() => {
    handleGetListUser(searchParams);
  }, [searchParams]);

  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: 'TÀI KHOẢN',
    }));
  });

  return (
    <Row className="account-management_container">
      <Breadcrumb title="Quản lý tài khoản" />
      <Container>
        <Form form={form} layout="vertical" className="account-management_form " onFinish={handleSubmitSearchAccount}>
          <Row gutter={[12, 0]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="search" required={false}>
                <InputUI allowClear placeholder="Nhập email hoặc số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Loại tài khoản" name="role" required={false}>
                <SelectUI placeholder="Chọn loại tài khoản" options={TYPES_ACCOUNT_ALL} />
              </Form.Item>
            </Col>
            <Col span={14}></Col>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} onClick={handleToggleModal} className="btn btn-add">
                Thêm nhân viên
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          dataSource={listUser?.data?.length > 0 ? (listUser?.data[0] as never) : []}
          columns={columns}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
          loading={isLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Container>
      <AddOrUpdateAccount
        onCancel={offEditOrAddAccountModal}
        isActive={editOrAddAccountState.open}
        data={editOrAddAccountState?.data}
      />
    </Row>
  );
};

export default React.memo(AccountManagement);
