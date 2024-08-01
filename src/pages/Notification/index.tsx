/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  InputUI,
  PopupConfirm,
  SearchColorBlueIcon,
  SearchIcon,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, authUser, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { TableParams } from '@/models/common.model';
import { IGetListParamNotification, INotification } from '@/models/notification.model';
import { deleteNotificationAPI, getListNotificationAPI } from '@/services/api/notification';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import { DatePickerProps } from 'antd/lib';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './Notification.scss';

const NotificationManagement: React.FC = () => {
  const [form] = Form.useForm();
  const currentDate = dayjs();
  const { isLoading, withLoading } = useLoading();
  const tempStartMonth = dayjs().month(currentDate.month()).date(currentDate.date());
  const [startMonth, setStartMonth] = useState<dayjs.Dayjs>(tempStartMonth);
  const [listNotification, setListNotification] = useState<INotification[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListParamNotification>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
    receiverId: authUser?.id || '',
  });
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();

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

  /** handle get list product */
  const handleGetListNotification = async (values: IGetListParamNotification) => {
    await withLoading(async () => {
      try {
        const res = await getListNotificationAPI({ ...values });
        setListNotification(res?.data);
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

  /** handleOnSubmitDelete */
  const handleOnSubmitDelete = async (row: INotification) => {
    try {
      if (row?.id) await deleteNotificationAPI(row?.id);
      message.success('Xóa tin tức thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartMonth(date);
  };

  /** handle submit */
  const handleSubmit = async (values: any) => {
    setSearchParams({
      pageSize: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
      receiverId: authUser?.id || '68821b5d-176c-4e2d-a0ca-2cd7d0641d47',
    });
  };

  /** config data */
  const columns: TableColumnsType<INotification> = [
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
      title: 'Tiêu đề của thông báo',
      dataIndex: 'title',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.data?.title} content={row?.data?.title} />;
      },
    },
    {
      title: 'Ngày gửi thông báo ',
      dataIndex: 'date',
      width: '20%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={
              row?.data?.time ? format(new Date(row?.data?.time), 'dd/MM/yyyy HH:mm:ss') : row?.data?.time || 'N/A'
            }
            content={
              row?.data?.time ? format(new Date(row?.data?.time), 'dd/MM/yyyy HH:mm:ss') : row?.data?.time || 'N/A'
            }
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
      render: (text, row) => {
        return (
          <Row gutter={[8, 10]} justify={'center'}>
            <Col className={`pointer`}>
              <SearchColorBlueIcon />
            </Col>
            <Col
              className={`pointer`}
              onClick={() => {
                toggleConfirmModal(true, 'delete', row)();
              }}
            >
              <TrashIcon />
            </Col>
          </Row>
        );
      },
    },
  ];

  /** Use Effect */
  useEffect(() => {
    if (authUser?.id) {
      handleGetListNotification(searchParams);
    }
  }, [searchParams, authUser?.id]);

  return (
    <Row className="notification-management_container">
      <Breadcrumb title="Danh Sách thông Báo" />
      <Container>
        <Form form={form} layout="vertical" className="notification-management_form" onFinish={handleSubmit}>
          <Row>
            <Col span={5}>
              <Form.Item label="Tiêu đề tin tức" name="search" required={false}>
                <InputUI placeholder="Tiêu đề thông báo" />
              </Form.Item>
            </Col>
            <Col span={18}></Col>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={4}>
              {/* <Button
                icon={<PlusIcon />}
                // onClick={handleNavigator}
                className="btn btn-add"
              >
                Thêm thông báo
              </Button> */}
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          loading={isLoading}
          dataSource={listNotification ? (listNotification as never) : []}
          columns={columns}
          pagination={tableParams.pagination}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
          onChange={handleTableChange}
        />
      </Container>

      <PopupConfirm
        onCancel={offConfirmModal}
        isActive={confirmState.open}
        data={confirmState?.data}
        onSubmit={handleOnSubmitDelete}
        onSuccess={() =>
          handleGetListNotification({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(NotificationManagement);
