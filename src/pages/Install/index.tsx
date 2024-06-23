/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PencilIcon, SearchIcon, TooltipCell, TooltipParagraph } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, defaultTableParams } from '@/constants';
import { ESTATUS } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { TableParams } from '@/models/common.model';
import { IGetListParamInstall, IInstallRecord } from '@/models/install.model';
import { getListInstallAPI } from '@/services/api/install';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import AddOrUpdateInstall from './AddOrUpdateInstall';
import './Install.scss';

const InstallManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddInstallState,
    toggleModal: toggleEditOrAddInstallModal,
    offModal: offEditOrAddInstallModal,
  } = useModal();
  const [listInstall, setListInstall] = useState<IInstallRecord[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListParamInstall>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
  });

  /** handle ToggleModal */
  const handleToggleModal = (data: any) => {
    toggleEditOrAddInstallModal(true, 'edit', data)();
  };

  /** handle submit */
  const handleSubmit = () => {};

  /** handle Table Change */
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

  /** handle get list product */
  const handleGetListInstall = async (values: IGetListParamInstall) => {
    await withLoading(async () => {
      try {
        const res = await getListInstallAPI({ ...values });
        setListInstall(res?.data);
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

  /** config data */
  const columns: TableColumnsType<IInstallRecord> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={(index + 1).toString()} />;
      },
    },
    {
      title: 'Trường học lắp đặt',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.school?.name} content={row?.school?.name} />;
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
      title: 'Nhân viên kỹ thuật',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipParagraph placement="topLeft" title={row?.staff ? row?.staff?.fullName : 'Chưa có'}>
            <Typography.Text className="text_cell">{row?.staff ? row?.staff?.fullName : 'Chưa có'}</Typography.Text>
            <br />
            <Typography.Text className="text_date">
              Lắp đặt lúc:{' '}
              {row?.timeInstall ? format(new Date(row?.timeInstall), 'dd/MM/yyyy HH:mm:ss') : row?.timeInstall || 'N/A'}
            </Typography.Text>
          </TooltipParagraph>
        );
      },
    },
    {
      title: 'Thời gian bảo hành',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={row?.warrantyPeriod ? (row?.warrantyPeriod as never) : 'N/A'}
            content={row?.warrantyPeriod ? (row?.warrantyPeriod as never) : 'N/A'}
          />
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
                : row?.status?.id === ESTATUS.INPROGRESS_INSTALL
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
          <Col onClick={() => handleToggleModal(row)} className="pointer">
            <PencilIcon />
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
    handleGetListInstall(searchParams);
  }, [searchParams]);

  return (
    <Row className="contract-management_container">
      <Breadcrumb title="Hồ sơ sự cố" />
      <Container>
        <Form form={form} layout="vertical" className="contract-management_form" onFinish={handleSubmit}>
          <Row gutter={[10, 0]}>
            <Col span={6}>
              <Form.Item label="Từ khóa tìm kiếm" name="title" required={false}>
                <InputUI placeholder="Mã hoặc tên hồ sơ sự cố" />
              </Form.Item>
            </Col>
            <Col span={18}></Col>
            <Col span={5}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          loading={isLoading}
          dataSource={listInstall ? (listInstall as never) : []}
          columns={columns}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
          onChange={handleTableChange}
          pagination={tableParams.pagination}
        />
      </Container>
      <AddOrUpdateInstall
        onCancel={offEditOrAddInstallModal}
        isActive={editOrAddInstallState.open}
        data={editOrAddInstallState?.data}
        onSuccess={() =>
          handleGetListInstall({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(InstallManagement);
