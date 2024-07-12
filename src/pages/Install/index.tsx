/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PencilIcon, SearchIcon, TooltipCell, TooltipParagraph } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, defaultTableParams } from '@/constants';
import { ESTATUS } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { TableParams } from '@/models/common.model';
import { IGetListParamInstall, IInstallRecord } from '@/models/install.model';
import { getListInstallAPI } from '@/services/api/install';
import { convertDate } from '@/utils/common';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx-js-style';
import { alternateRowStyle, headerStyle, rowStyle } from '../Dashboard/utils';
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
          <Col
            onClick={() => {
              if (row?.status?.id === ESTATUS.DELETED) {
                return;
              }
              handleToggleModal(row);
            }}
            className={`pointer ${row?.status?.id === ESTATUS.DELETED ? 'disable' : ''}`}
          >
            <PencilIcon />
          </Col>
        </Row>
      ),
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  const generateXLSXFile = async (data: IInstallRecord[], filename: string) => {
    try {
      const rows = data?.map((item) => ({
        school: item?.school?.name,
        product: item?.product?.name,
        quantity: item?.quantity,
        totalAmount: item?.totalAmount,
        createdBy: item?.account?.fullName,
        timeCreated: `${convertDate(new Date(new Date(item?.createdAt)))} - ${
          item?.createdAt ? format(new Date(item?.createdAt), 'dd/MM/yyyy') : 'N/A'
        }`,
        staff: item?.staff?.fullName,
        timeInstall: `${convertDate(new Date(new Date(item?.timeInstall)))} - ${
          item?.timeInstall ? format(new Date(item?.timeInstall), 'dd/MM/yyyy') : 'N/A'
        }`,
        warrantyPeriod: item?.warrantyPeriod,
        status: item?.status?.name,
      }));
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hồ sơ lắp đặt');
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            'Trường lắp đặt',
            'Thiết bị',
            'Số lượng lắp',
            'Tổng tiền lắp đặt',
            'Người tạo hồ sơ',
            'Thời gian tạo',
            'Nhân viên lắp đặt',
            'Thời gian lắp đặt',
            'Thời gian bảo hành',
            'Trạng thái',
          ],
        ],
        { origin: 'A1' },
      );

      const max_width = {
        school: rows.reduce((w: any, r: any) => Math.max(w, r?.school && r.school?.toString().length), 16),
        product: rows.reduce((w: any, r: any) => Math.max(w, r?.product && r.product?.toString().length), 16),
        quantity: rows.reduce((w: any, r: any) => Math.max(w, r?.quantity && r.quantity.toString().length), 16),
        totalAmount: rows.reduce((w: any, r: any) => Math.max(w, r?.totalAmount && r.totalAmount.toString().length), 8),
        createdBy: rows.reduce((w: any, r: any) => Math.max(w, r?.createdBy && r.createdBy.toString().length), 10),
        timeCreated: rows.reduce(
          (w: any, r: any) => Math.max(w, r?.timeCreated && r.timeCreated?.toString().length),
          10,
        ),
        staff: rows.reduce((w: any, r: any) => Math.max(w, r?.staff && r.staff?.toString().length), 16),
        timeInstall: rows.reduce(
          (w: any, r: any) => Math.max(w, r?.timeInstall && r.timeInstall?.toString().length),
          8,
        ),
        warrantyPeriod: rows.reduce(
          (w: any, r: any) => Math.max(w, r?.warrantyPeriod && r.warrantyPeriod?.toString().length),
          8,
        ),
        status: rows.reduce((w: any, r: any) => Math.max(w, r?.status && r.status.length), 10),
      };
      worksheet['!cols'] = [
        { wch: max_width.school },
        { wch: max_width.product },
        { wch: max_width.quantity },
        { wch: max_width.totalAmount },
        { wch: max_width.createdBy },
        { wch: max_width.timeCreated },
        { wch: max_width.staff },
        { wch: max_width.timeInstall },
        { wch: max_width.warrantyPeriod },
        { wch: max_width.status },
      ];

      // Apply styles
      worksheet['A1'].s = headerStyle;
      worksheet['B1'].s = headerStyle;
      worksheet['C1'].s = headerStyle;
      worksheet['D1'].s = headerStyle;
      worksheet['E1'].s = headerStyle;
      worksheet['F1'].s = headerStyle;
      worksheet['G1'].s = headerStyle;
      worksheet['H1'].s = headerStyle;
      worksheet['C1'].s = headerStyle;
      worksheet['I1'].s = headerStyle;
      worksheet['J1'].s = headerStyle;

      for (let R = 1; R <= rows.length; R++) {
        for (let C = 0; C < 11; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = R % 2 === 0 ? rowStyle : alternateRowStyle;
        }
      }
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error generating XLSX file:', error);
    }
  };
  const handleExportALlDataXLSX = async () => {
    withLoading(async () => {
      await generateXLSXFile(listInstall, 'installs.xlsx');
    });
  };

  /* Inittial value for root app */
  useEffect(() => {
    handleGetListInstall(searchParams);
  }, [searchParams]);

  return (
    <Row className="contract-management_container">
      <div className="export_action-header-management">
        <Breadcrumb title="Hồ sơ lắp đặt" />
        <Button onClick={handleExportALlDataXLSX} style={{ width: 160 }} className="btn btn-add">
          Xuất báo cáo
        </Button>
      </div>

      <Container>
        <Form form={form} layout="vertical" className="contract-management_form" onFinish={handleSubmit}>
          <Row gutter={[10, 0]}>
            <Col span={6}>
              <Form.Item label="Từ khóa tìm kiếm" name="title" required={false}>
                <InputUI placeholder="Mã hoặc tên Hồ sơ lắp đặt" />
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
