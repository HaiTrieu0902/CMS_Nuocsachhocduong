/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  InputUI,
  PencilIcon,
  PlusIcon,
  PopupConfirm,
  SearchIcon,
  SelectUI,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, TYPES_ACCOUNT_ALL, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IAccount, IGetListParamsUser } from '@/models/account.model';
import { TableParams } from '@/models/common.model';
import { deleteUserAPI, getListUserAPI } from '@/services/api/account';
import { getRoleDescription } from '@/utils/common';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './Account.scss';
import AddOrUpdateAccount from './AddOrUpdateAccount';

const AccountManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const { stateModal: editOrAddState, toggleModal: toggleEditOrAddModal, offModal: offEditOrAddModal } = useModal();
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();

  const [listUser, setListUser] = useState<IAccount[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });

  const [searchParams, setSearchParams] = useState<IGetListParamsUser>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
    roleId: '',
  });

  const handleToggleModal = () => {
    toggleEditOrAddModal(true, 'add', {})();
  };

  /** handle get list product */
  const handleGetListUser = async (values: IGetListParamsUser) => {
    await withLoading(async () => {
      try {
        const res = await getListUserAPI(values);
        setListUser(res?.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: values.page,
            total: res.total,
          },
        });
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** handle submit */
  const handleSubmitSearchAccount = async (values: any) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
      roleId: values?.role || '',
    }));
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

  /** handleOnSubmitDelete */
  const handleOnSubmitDelete = async (row: IAccount) => {
    try {
      if (row?.id) await deleteUserAPI(row?.id);
      message.success('Xóa người dùng thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };
  /** config data */
  const columns: TableColumnsType<IAccount> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      align: 'right',
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
                <Col key={item.id} span={24}>
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
        return (
          <TooltipCell
            title={getRoleDescription(row?.role as string)}
            content={getRoleDescription(row?.role as string)}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]} justify={'center'}>
          <Col className="pointer" onClick={toggleEditOrAddModal(true, 'edit', row)}>
            <PencilIcon />
          </Col>
          <Col className="pointer" onClick={toggleConfirmModal(true, 'delete', row)}>
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
                Thêm tài khoản
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          dataSource={listUser?.length > 0 ? (listUser as never) : []}
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
        onCancel={offEditOrAddModal}
        isActive={editOrAddState.open}
        data={editOrAddState?.data}
        onSuccess={() =>
          handleGetListUser({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
      <PopupConfirm
        onCancel={offConfirmModal}
        isActive={confirmState.open}
        data={confirmState?.data}
        onSubmit={handleOnSubmitDelete}
        onSuccess={() =>
          handleGetListUser({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(AccountManagement);
