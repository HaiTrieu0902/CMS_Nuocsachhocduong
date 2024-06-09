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
import { IListNews, INews } from '@/models/news.model';
import { deleteNewsAPI, getListNewsAPI } from '@/services/api/new';
import { history } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import './News.scss';

const NewsManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();
  const { isLoading, withLoading } = useLoading();
  const currentDate = dayjs();
  const tempStartMonth = dayjs().month(currentDate.month()).date(currentDate.date());
  const [startMonth, setStartMonth] = useState<dayjs.Dayjs>(tempStartMonth);
  const [listNews, setListNews] = useState<IListNews>({} as IListNews);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });

  /** handle navigator */
  const handleNavigator = (id: string | null) => {
    if (id) {
      history.push(`/news/${id}`);
    } else {
      history.push(`/news/create`);
    }
  };
  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartMonth(date);
    console.log('date', date);
  };

  /** handle Table Change */
  const handleTableChange = (pagination: any) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  /** handle get list news */
  const handleGetListNews = async (values: IGetListParamCommon) => {
    await withLoading(async () => {
      try {
        const res = await getListNewsAPI(values);
        setListNews(res);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.data[1],
          },
        });
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** handle submit */
  const handleSubmitSearchNews = async (values: any) => {
    handleGetListNews({
      size: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search || '',
    });
  };

  /** handleOnSubmitDelete */
  const handleOnSubmitDelete = async (row: INews) => {
    try {
      if (row?.id) await deleteNewsAPI(row?.id);
      message.success('Xóa tin tức thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  /** config data */
  const columns: TableColumnsType<INews> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={`${(index + 1).toString()}`} />;
      },
    },
    {
      title: 'Tiêu đề tin tức',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.title} content={row?.title} />;
      },
    },
    {
      title: 'Ngày đăng tin ',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
      render: (text, row) => {
        return <TooltipCell title={row?.createdAt} content={row?.createdAt} isDate />;
      },
    },
    {
      title: 'Phân loại tin tức',
      dataIndex: 'notification',
      key: 'notification',
      width: '42%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={`${row?.position === 1 ? 'Tin tức nổi bật ' : 'Tin tức thường ngày'}`}
            content={`${row?.position === 1 ? 'Tin tức nổi bật ' : 'Tin tức thường ngày'}`}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]} justify={'center'}>
          <Col className="pointer" onClick={() => handleNavigator(row?.id || '')}>
            <PencilIcon></PencilIcon>
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
    handleGetListNews({
      size: tableParams?.pagination?.pageSize as number,
      page: tableParams?.pagination?.current as number,
    });
  }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  return (
    <Row className="news-management_container">
      <Breadcrumb title="Tin Tức" />
      <Container>
        <Form form={form} layout="vertical" className="news-management_form" onFinish={handleSubmitSearchNews}>
          <Row gutter={[16, 12]}>
            <Col span={5}>
              <Form.Item label="Tiêu đề tin tức" name="search" required={false}>
                <InputUI placeholder="Tiêu đề tin tức" allowClear />
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
                  placeholder="Chọn tháng / năm"
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
              <Button icon={<PlusIcon />} onClick={() => handleNavigator(null)} className="btn btn-add">
                Thêm tin tức
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          dataSource={listNews?.data?.length > 0 ? (listNews?.data[0] as never) : []}
          rowKey={(record: any) => record?.id}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
        />
      </Container>

      <PopupConfirm
        onCancel={offConfirmModal}
        isActive={confirmState.open}
        data={confirmState?.data}
        onSubmit={handleOnSubmitDelete}
        onSuccess={() =>
          handleGetListNews({
            size: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(NewsManagement);
