/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  CurrencyDollarIcon,
  InputUI,
  PencilIcon,
  PlusIcon,
  PopupConfirm,
  SearchIcon,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IGetQuerySchool, ISchool } from '@/models/school.model';
import { deleteSchoolAPI, getListSchoolAPI } from '@/services/api/school';
import { useAppDispatch, useAppSelector } from '@/store';
import { history } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { TableParams } from '../../models/common.model';
import AddOrUpdateSchool from './AddOrUpdateSchool';
import './School.scss';

const SchoolManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { isLoadingListSchool } = useAppSelector((state) => state.school);
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddSchoolState,
    toggleModal: toggleEditOrAddSchoolModal,
    offModal: offEditOrAddSchoolModal,
  } = useModal();
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();

  const [listSchool, setListSchool] = useState<ISchool[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetQuerySchool>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    isDelete: false,
  });

  /** handle toggle modal  */
  const handleToggleModal = (data: any) => {
    toggleEditOrAddSchoolModal(true, 'add', {})();
  };

  /** handle get list school */
  const handleGetListSchool = async (values: IGetQuerySchool) => {
    await withLoading(async () => {
      try {
        const res = await getListSchoolAPI(values);
        setListSchool(res?.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.total,
          },
        });
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };
  /** handle submit */
  const handleSubmitSearch = (values: any) => {
    handleGetListSchool({
      pageSize: tableParams?.pagination?.pageSize as number,
      page: tableParams?.pagination?.current as number,
      search: values?.search || '',
      isDelete: false,
    });
  };

  /** handle submit */
  const handleNavigate = (route: string) => {
    history.push(`/school/${route}`);
  };

  const handleOnSubmitDelete = async (row: ISchool) => {
    try {
      if (row?.id) await deleteSchoolAPI(row?.id);
      message.success('Xóa trường học thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  const handleTableChange = (pagination: any) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  /** config data */
  const columns: TableColumnsType<ISchool> = [
    {
      title: 'STT',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={(index + 1).toString()} />;
      },
    },
    {
      title: 'Tên trường học',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.name} content={row?.name} />;
      },
    },
    {
      title: 'Email',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.email} content={row?.email} />;
      },
    },

    {
      title: 'Số điện thoại',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.phoneNumber} content={row?.phoneNumber} />;
      },
    },

    {
      title: 'Tên trường học',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.name} content={row?.name} />;
      },
    },
    {
      title: 'Địa chỉ',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.address} content={row?.address} />;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: '12%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]} justify={'center'}>
          <Col className="pointer" onClick={toggleEditOrAddSchoolModal(true, 'edit', row)}>
            <PencilIcon />
          </Col>
          <Col className="pointer" onClick={toggleConfirmModal(true, 'delete', row)}>
            <TrashIcon />
          </Col>
          <Col
            className="pointer"
            // onClick={() => {
            //   handleNavigate(`revenue/${row?.id}`);
            //   dispatch(setNameSchool(row?.name));
            // }}
          >
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
    handleGetListSchool(searchParams);
  }, [searchParams, isLoadingListSchool]);

  return (
    <Row className="school-management_container">
      <Breadcrumb title="Quản lý trường học" />
      <Container>
        <Form form={form} layout="vertical" className="school-management_form -mb-18" onFinish={handleSubmitSearch}>
          <Row gutter={[16, 12]}>
            <Col span={5}>
              <Form.Item label="Nhập mã hoặc tên trường học" name="search" required={false}>
                <InputUI placeholder="Nhập mã hoặc tên trường học" />
              </Form.Item>
            </Col>

            <Col span={19}></Col>
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
          dataSource={listSchool?.length > 0 ? (listSchool as never) : []}
          columns={columns}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          rowKey={(record) => record.id as never}
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
      <PopupConfirm
        onCancel={offConfirmModal}
        isActive={confirmState.open}
        data={confirmState?.data}
        onSubmit={handleOnSubmitDelete}
        onSuccess={() =>
          handleGetListSchool({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
            isDelete: false,
          })
        }
      />
    </Row>
  );
};

export default React.memo(SchoolManagement);
