/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  InputUI,
  PencilIcon,
  PlusIcon,
  PopupConfirm,
  SearchColorBlueIcon,
  SearchIcon,
  SelectUI,
  TooltipCell,
  TooltipParagraph,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, STATE_MAINTENANCE_ALL, defaultTableParams } from '@/constants';
import { ESTATUS } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { TableParams } from '@/models/common.model';
import { IGetListParamMaintenance, IMaintenance } from '@/models/maintenance.model';
import { deleteMaintenanceAPI, getListMaintenanceAPI } from '@/services/api/maintenance';
import { useModel } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import AddOrUpdateMaintain from './AddOrUpdateMaintain';
import './Maintain.scss';

const MaintenanceManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddMaintainState,
    toggleModal: toggleEditOrAddMaintainModal,
    offModal: offEditOrAddMaintainModal,
  } = useModal();
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();
  const [listMaintenance, setListMaintenance] = useState<IMaintenance[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListParamMaintenance>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
  });

  /** handle tooggle modal add*/
  const handleToggleModal = (data: any) => {
    toggleEditOrAddMaintainModal(true, 'edit', data)();
  };

  /** handle change tab*/
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

  /** handle get list maintenance*/
  const handleGetListMaintenance = async (values: IGetListParamMaintenance) => {
    await withLoading(async () => {
      try {
        const res = await getListMaintenanceAPI(values);
        setListMaintenance(res?.data);
        setTableParams((prevParams) => ({
          ...prevParams,
          pagination: {
            ...prevParams.pagination,
            current: values.page,
            total: res.total,
          },
        }));
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** handle submit search*/
  const handleSubmitSearch = (values: any) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
      statusId: values?.status || '',
    }));
  };

  /** handleOnSubmitDelete */
  const handleOnSubmitDelete = async (row: IMaintenance) => {
    try {
      if (row?.id) await deleteMaintenanceAPI(row?.id);
      message.success('Xóa sự cố thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  const columns: TableColumnsType<IMaintenance> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={(index + 1).toString()} />;
      },
    },
    {
      title: 'Trường gặp sự cố',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.school?.name} content={row?.school?.name} />;
      },
    },
    {
      title: 'Thông tin sự cố',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.reason} content={row?.reason} />;
      },
    },
    {
      title: 'Người tạo',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipParagraph placement="topLeft" title={row?.account?.fullName}>
            <Typography.Text className="text_cell">{row?.account?.fullName}</Typography.Text>
            <br />
            <Typography.Text className="text_date">
              {row?.createdAt ? format(new Date(row?.createdAt), 'dd/MM/yyyy HH:mm:ss') : row?.createdAt || 'N/A'}
            </Typography.Text>
          </TooltipParagraph>
        );
      },
    },

    {
      title: 'Nhân viên xử lý',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipParagraph placement="topLeft" title={row?.staff ? row?.staff?.fullName : 'Chưa tiếp nhận'}>
            <Typography.Text className="text_cell">
              {row?.staff ? row?.staff?.fullName : 'Chưa tiếp nhận'}
            </Typography.Text>
            <br />
            <Typography.Text className="text_date">
              Lắp đặt lúc:{' '}
              {row?.timeMaintenance
                ? format(new Date(row?.timeMaintenance), 'dd/MM/yyyy HH:mm:ss')
                : row?.timeMaintenance || 'N/A'}
            </Typography.Text>
          </TooltipParagraph>
        );
      },
    },

    {
      title: 'Trạng thái',
      width: '12%',
      render: (text, row) => {
        return (
          <TooltipCell
            className={`${
              row?.status?.id === ESTATUS.DELETED
                ? 'text_danger'
                : row?.status?.id === ESTATUS.INPROGRESS
                ? 'text_inprogress'
                : row?.status?.id === ESTATUS.COMPLETE || row?.status?.id === ESTATUS.COMPLETED
                ? 'text_complete'
                : 'text_pending'
            }`}
            title={row?.status?.name}
            content={row?.status?.name}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]} justify={'center'}>
          {row?.status?.id === ESTATUS.COMPLETED ? (
            <Col className="pointer" onClick={toggleEditOrAddMaintainModal(true, 'view', row)}>
              <SearchColorBlueIcon />
            </Col>
          ) : (
            <>
              <Col className="pointer" onClick={toggleEditOrAddMaintainModal(true, 'edit', row)}>
                <PencilIcon />
              </Col>
            </>
          )}

          {/* <Col className="pointer" onClick={toggleConfirmModal(true, 'delete', row)}>
            <TrashIcon />
          </Col> */}
        </Row>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  useEffect(() => {
    handleGetListMaintenance(searchParams);
  }, [searchParams]);

  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: `${
        listMaintenance?.length > 0
          ? listMaintenance?.filter((item) => item?.status?.id === ESTATUS?.PENDING)?.length
          : ''
      } SỰ CỐ, BẢO DƯỠNG CHƯA ĐƯỢC XỬ LÝ`,
    }));
  }, [listMaintenance]);

  return (
    <Row className="maintain-management_container">
      <Breadcrumb title="Bảo dưỡng - sửa chữa" />
      <Container>
        <Form form={form} layout="vertical" className="maintain-management_form" onFinish={handleSubmitSearch}>
          <Row gutter={[12, 0]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="search" required={false}>
                <InputUI allowClear placeholder="Mã sự cố, bảo dưỡng" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Trạng thái" name="status" required={false}>
                <SelectUI placeholder="Chọn trạng thái" options={STATE_MAINTENANCE_ALL} />
              </Form.Item>
            </Col>
            <Col span={14}></Col>
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
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          loading={isLoading}
          dataSource={listMaintenance?.length > 0 ? (listMaintenance as never) : []}
          columns={columns}
          rowKey={(record) => record.id as string}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Container>
      <AddOrUpdateMaintain
        onCancel={offEditOrAddMaintainModal}
        isActive={editOrAddMaintainState.open}
        data={editOrAddMaintainState?.data}
        onSuccess={() => handleGetListMaintenance(searchParams)}
      />

      <PopupConfirm
        onCancel={offConfirmModal}
        isActive={confirmState.open}
        data={confirmState?.data}
        onSubmit={handleOnSubmitDelete}
        onSuccess={() =>
          handleGetListMaintenance({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(MaintenanceManagement);
