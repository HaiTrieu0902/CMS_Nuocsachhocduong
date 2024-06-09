/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  DatePickerUI,
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
import { IGetListParamCommon, TableParams } from '@/models/common.model';
import { IDataNotification, INotification, INotificationList } from '@/models/notification.model';
import { deleteNotificationAPI, getListNotificationAPI } from '@/services/api/notification';
import { history } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './Notification.scss';

const NotificationManagement: React.FC = () => {
  const [form] = Form.useForm();
  const currentDate = dayjs();
  const { isLoading, withLoading } = useLoading();
  const tempStartMonth = dayjs().month(currentDate.month()).date(currentDate.date());
  const [startMonth, setStartMonth] = useState<dayjs.Dayjs>(tempStartMonth);
  const [listNotification, setListNotification] = useState<INotificationList[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListParamCommon>({
    size: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
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
  const handleGetListNotification = async (values: IGetListParamCommon) => {
    await withLoading(async () => {
      try {
        const res = await getListNotificationAPI({ ...values });
        setListNotification(res?.data[0]);
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

  /** handleOnSubmitDelete */
  const handleOnSubmitDelete = async (row: INotification) => {
    try {
      if (row?.id) await deleteNotificationAPI(row?.id);
      message.success('Xóa tin tức thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  const handleNavigator = () => {
    history.push(`/notification/create`);
  };
  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartMonth(date);
  };

  /** handle submit */
  const handleSubmit = async (values: any) => {
    setSearchParams({
      size: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
    });
  };

  /** config data */
  const columns: TableColumnsType<IDataNotification> = [
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
        return <TooltipCell title={row?.title} content={row?.title} />;
      },
    },
    {
      title: 'Ngày gửi thông báo ',
      dataIndex: 'date',

      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.timeSend} isDate content={row?.timeSend} />;
      },
    },
    {
      title: 'Trường học nhận thông báo',
      dataIndex: 'notification',
      width: '42%',
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
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text, row) => {
        const currentDate = dayjs();
        const timeSend = dayjs(row?.timeSend);
        const isBeforeCurrentDate = timeSend.isBefore(currentDate, 'day');
        return (
          <Row gutter={[8, 10]} justify={'center'}>
            <Col
              className={` ${isBeforeCurrentDate ? 'disabled' : 'pointer'}`}
              onClick={() => {
                if (!isBeforeCurrentDate) {
                  history.push(`/notification/${row?.id}`, row);
                }
              }}
            >
              <PencilIcon />
            </Col>
            <Col
              className={` ${isBeforeCurrentDate ? 'disabled' : 'pointer'}`}
              onClick={() => {
                if (!isBeforeCurrentDate) {
                  toggleConfirmModal(true, 'delete', row)();
                }
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
    handleGetListNotification(searchParams);
  }, [searchParams]);

  return (
    <Row className="notification-management_container">
      <Breadcrumb title="Danh Sách thông Báo" />
      <Container>
        <Form form={form} layout="vertical" className="notification-management_form" onFinish={handleSubmit}>
          <Row gutter={[16, 12]}>
            <Col span={5}>
              <Form.Item label="Tiêu đề tin tức" name="search" required={false}>
                <InputUI placeholder="Tiêu đề thông báo" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Tháng/Năm" name="date" required={false}>
                <DatePickerUI
                  allowClear={false}
                  picker="month"
                  value={dayjs(startMonth)}
                  format={'MM/YYYY'}
                  onChange={handleDateChange}
                />
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
              <Button icon={<PlusIcon />} onClick={handleNavigator} className="btn btn-add">
                Thêm thông báo
              </Button>
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
            size: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(NotificationManagement);
