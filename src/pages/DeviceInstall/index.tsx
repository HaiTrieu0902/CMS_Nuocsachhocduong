/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, SearchIcon, TooltipCell, TooltipParagraph } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import { TableParams } from '@/models/common.model';
import { IGetListParamInstall, IInstallRecord } from '@/models/install.model';
import { getListDeviceInstallAPI } from '@/services/api/install';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
//import AddOrUpdateInstall from './AddOrUpdateInstall';
import { BASE_URL } from '@/constants/urls';
import { calculateWarrantyExpiryDate, revertNoteDevice, revertStatusDevice } from '@/utils/common';
import './DeviceInstall.scss';
const InstallManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const [listInstall, setListInstall] = useState<IInstallRecord[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListParamInstall>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
  });

  /** handle submit */
  const handleSubmitSearch = (values: any) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
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
      pageSize: pagination.pageSize,
    }));
  };

  /** handle get list product */
  const handleGetListInstall = async (values: IGetListParamInstall) => {
    await withLoading(async () => {
      try {
        const res = await getListDeviceInstallAPI({ ...values });
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
      title: 'Thiết bị lắp đặt',
      width: '30%',
      render: (text, row) => {
        return (
          <Row gutter={[12, 12]}>
            <Col span={10}>
              <img
                src={`${BASE_URL}/${row?.product?.images[0] || ''}`}
                alt=""
                style={{ width: '100%', height: 128, objectFit: 'cover', borderRadius: 16 }}
              />
            </Col>
            <Col span={14}>
              <Row>
                <Typography.Text style={{ fontWeight: 600 }} className="text_cell">
                  {row?.product?.name}
                </Typography.Text>
                <Typography.Text className="text_cell">Số lượng lắp đặt: {row?.quantity} thiết bị</Typography.Text>
                <Typography.Text className="text_cell"></Typography.Text>
              </Row>
            </Col>
          </Row>
        );
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
      title: 'Nhân viên lắp đặt',
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
      title: 'Thời hạn bảo hành',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={calculateWarrantyExpiryDate(row?.timeInstall, row?.warrantyPeriod)}
            content={calculateWarrantyExpiryDate(row?.timeInstall, row?.warrantyPeriod)}
          />
        );
      },
    },
    {
      title: 'Hiện trạng thiết bị',
      width: '12%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={revertStatusDevice(row)}
            content={revertStatusDevice(row)}
            className={`${
              revertStatusDevice(row) === 'Bình thường'
                ? 'text_complete'
                : revertStatusDevice(row) === 'Đang sửa chữa'
                ? 'text_danger'
                : revertStatusDevice(row) === 'Đang bảo dưỡng'
                ? 'text_pending'
                : 'text_inprogress'
            }`}
          />
        );
      },
    },
    {
      title: 'Ghi chú(nếu có)',
      width: '12%',
      render: (text, row) => {
        return <TooltipCell title={revertNoteDevice(row)} content={revertNoteDevice(row)} />;
      },
    },
  ];

  /* Inittial value for root app */
  useEffect(() => {
    handleGetListInstall(searchParams);
  }, [searchParams]);

  return (
    <Row className="contract-management_container">
      <div className="export_action-header-management">
        <Breadcrumb title="Các thiết bị đã lắp đặt" />
        {/* <Button onClick={handleExportALlDataXLSX} style={{ width: 160 }} className="btn btn-add">
          Xuất báo cáo
        </Button> */}
      </div>

      <Container>
        <Form form={form} layout="vertical" className="contract-management_form" onFinish={handleSubmitSearch}>
          <Row gutter={[10, 0]}>
            <Col span={6}>
              <Form.Item label="Từ khóa tìm kiếm" name="search" required={false}>
                <InputUI placeholder="Nhập tên thiết bị hoặc trường học lắp đặt" />
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
    </Row>
  );
};

export default React.memo(InstallManagement);
