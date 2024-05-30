import {
  Breadcrumb,
  Container,
  InputUI,
  PencilIcon,
  PlusIcon,
  SearchColorBlueIcon,
  SearchIcon,
  SelectUI,
  TooltipCell,
  TooltipParagraph,
  TrashIcon,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, STATE_MAINTENNANCE_ALL, defaultTableParams } from '@/constants';
import { EMaintenanceStatus } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { TableParams } from '@/models/common.model';
import { IGetListMaintenance, IListMaintenance, IMaintenance } from '@/models/maintenance.model';
import { getListMaintenanceAPI } from '@/services/api/maintenance';
import { getStatusText } from '@/utils/common';
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
  const [listMaintenance, setListMaintenance] = useState<IListMaintenance>({} as IListMaintenance);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListMaintenance>({
    size: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
    status: '',
  });

  /** handle tooggle modal add*/
  const handleToggleModal = () => {
    toggleEditOrAddMaintainModal(true, 'add', {})();
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
  const handleGetListMaintenance = async (values: IGetListMaintenance) => {
    await withLoading(async () => {
      try {
        const res = await getListMaintenanceAPI(values);
        setListMaintenance(res);
        setTableParams((prevParams) => ({
          ...prevParams,
          pagination: {
            ...prevParams.pagination,
            current: values.page,
            total: res.data[1],
          },
        }));
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** handle submit search*/
  const handleSubmitSearch = (values: any) => {
    setSearchParams({
      size: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
      status: values?.status || '',
    });
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
      title: 'Mã',
      key: 'code',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.code} content={row?.code} />;
      },
    },
    {
      title: 'Thông tin sự cố',
      key: 'infomation',
      width: '40%',
      render: (text, row) => {
        return <TooltipCell className="truncate" title={row?.title} content={row?.title} />;
      },
    },
    {
      title: 'Người tạo',
      key: 'create',
      width: '20%',
      render: (text, row) => {
        return (
          <TooltipParagraph placement="topLeft" title={row?.createdBy}>
            <Typography.Text className="text_cell">{row?.createdBy}</Typography.Text>
            <br />
            <Typography.Text className="text_date">
              {row?.createdAt ? format(new Date(row?.createdAt), 'dd/MM/yyyy HH:mm:ss') : row?.createdAt || 'N/A'}
            </Typography.Text>
          </TooltipParagraph>
        );
      },
    },
    {
      title: 'Người xử lý',
      key: 'handle',
      width: '20%',
      render: (text, row) => {
        return (
          <TooltipParagraph placement="topLeft" title={row?.staff?.fullName}>
            <Typography.Text className="text_cell">{row?.staff?.fullName || 'Chưa có'}</Typography.Text>
            <br />
            <Typography.Text className="text_date">
              {row?.dateAssigned
                ? format(new Date(row?.dateAssigned), 'dd/MM/yyyy HH:mm:ss')
                : row?.dateAssigned || 'N/A'}
            </Typography.Text>
          </TooltipParagraph>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: '20%',
      render: (text, row) => {
        return (
          <Row>
            <Button
              className={`${
                row?.status === EMaintenanceStatus.COMPLETE || row?.status === EMaintenanceStatus.COMPLETED
                  ? 'btn_type2 btn-primary'
                  : row?.status === EMaintenanceStatus.PENDING
                  ? 'btn_type2 btn-error'
                  : 'btn_type2 btn-add'
              }`}
              style={{ width: 122 }}
            >
              {getStatusText(row?.status as never)}
            </Button>
          </Row>
        );
      },
    },

    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]}>
          {row?.status === EMaintenanceStatus.COMPLETE || row?.status === EMaintenanceStatus.COMPLETED ? (
            <Col className="pointer" onClick={toggleEditOrAddMaintainModal(true, 'view', row)}>
              <SearchColorBlueIcon />
            </Col>
          ) : (
            <React.Fragment>
              <Col className="pointer" onClick={toggleEditOrAddMaintainModal(true, 'edit', row)}>
                <PencilIcon />
              </Col>
              <Col className="pointer">
                <TrashIcon />
              </Col>
            </React.Fragment>
          )}
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
      data: '30 SỰ CỐ, BẢO DƯỠNG CHƯA ĐƯỢC XỬ LÝ',
    }));
  }, [setInitialState]);

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
                <SelectUI placeholder="Chọn trạng thái" options={STATE_MAINTENNANCE_ALL} />
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
          dataSource={listMaintenance?.data?.length > 0 ? (listMaintenance?.data[0] as never) : []}
          columns={columns}
          rowKey={(record) => record.code}
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
    </Row>
  );
};

export default React.memo(MaintenanceManagement);
