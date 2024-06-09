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
import { TableParams } from '@/models/common.model';
import { IGetQueryRevenueSchool, IRevenueSchool, IRevenueSchoolList } from '@/models/school.model';
import {
  createRevenueSchoolAPI,
  deleteRevenueSchoolAPI,
  getListRevenueSchoolAPI,
  updateRevenueSchoolAPI,
} from '@/services/api/school';
import { useAppSelector } from '@/store';
import { checkKeyCode } from '@/utils/common';
import { useParams } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, Typography, message } from 'antd';
import { DatePickerProps } from 'antd/lib';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './Revenue.scss';

const tempStartMonth = dayjs().month(dayjs().month()).date(dayjs().date());
const Revenue = () => {
  const { nameSchool } = useAppSelector((state) => state.school);
  const { isLoading, withLoading } = useLoading();
  const [typeValues, setTypeValues] = useState<{ idRevenue: string; type: string }>({
    idRevenue: '',
    type: 'add',
  });
  const { id } = useParams<{ id: string }>();
  const [formCreate] = Form.useForm();
  const [formAction] = Form.useForm();
  const [listRevenue, setListRevenue] = useState<IRevenueSchoolList>({} as IRevenueSchoolList);
  const [startMonth, setStartMonth] = useState<dayjs.Dayjs>(tempStartMonth);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();
  const [searchParams, setSearchParams] = useState<IGetQueryRevenueSchool>({
    size: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    schoolId: '',
  });

  /** handle handleActionRevenue*/
  const handleActionRevenue = (values: any) => {
    setSearchParams({
      size: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      startDate: dayjs(values?.startDate).startOf('month') || '',
      endDate: dayjs(values?.endDate).endOf('month') || '',
    });
  };

  /** handle change date */
  const handleDateChange: DatePickerProps['onChange'] = (date: any) => {
    setStartMonth(date);
    console.log('date', date);
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
  const handleOnSubmitDelete = async (row: IRevenueSchool) => {
    try {
      if (row?.id) await deleteRevenueSchoolAPI(row?.id);
      message.success('Xóa doanh thu trường học thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  /** handle get list revenue */
  const handleGetListRevenue = async (values: IGetQueryRevenueSchool, id: string) => {
    await withLoading(async () => {
      try {
        const res = await getListRevenueSchoolAPI({ ...values, schoolId: id });
        setListRevenue(res);
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

  /** handle handleCreateRevenue */
  const handleCreateRevenue = async (values: any) => {
    await withLoading(async () => {
      try {
        if (id) {
          const params = {
            time: dayjs(values?.time).date(15),
            cost: Number(values?.cost),
            schoolId: id,
            numberStudent: Number(values?.numberStudent),
          };
          if (typeValues?.type === 'edit' && typeValues?.idRevenue) {
            await updateRevenueSchoolAPI({ ...params }, typeValues?.idRevenue);
            message.success('Cập nhật thành công');
          } else {
            await createRevenueSchoolAPI(params);
            message.success('Thêm doanh thu trường học thành công');
          }
          handleGetListRevenue(
            {
              size: tableParams?.pagination?.pageSize as number,
              page: tableParams?.pagination?.current as number,
            },
            id,
          );
          setTypeValues({ idRevenue: '', type: 'add' });
          formCreate.resetFields();
        }
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  /** EFFECT */
  useEffect(() => {
    if (id) {
      handleGetListRevenue(searchParams, id);
    }
  }, [searchParams, id]);

  /** co nfig data */
  const columns: TableColumnsType<IRevenueSchool> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={`${(index + 1).toString()}`} />;
      },
    },
    {
      title: 'Tháng/Năm',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.time} content={row?.time} isDate formatDate="MM/yyyy" />;
      },
    },
    {
      title: 'Số lượng học sinh',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={String(row?.numberStudent)} content={String(row?.numberStudent)} />;
      },
    },
    {
      title: 'Giá tiền mỗi học sinh',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={`${Number(row?.cost)?.toLocaleString()} VNĐ`}
            content={`${Number(row?.cost)?.toLocaleString()} VNĐ`}
          />
        );
      },
    },
    {
      title: 'Tổng tiền',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={`${Number(row?.cost * row?.numberStudent)?.toLocaleString()} VNĐ`}
            content={`${Number(row?.cost * row?.numberStudent)?.toLocaleString()} VNĐ`}
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
            className="pointer"
            onClick={() => {
              setTypeValues({ idRevenue: row?.id, type: 'edit' });
              console.log('row', row?.time);
              const setForm = {
                time: dayjs(row?.time),
                numberStudent: row?.numberStudent,
                cost: row?.cost,
              };
              formCreate.setFieldsValue(setForm);
            }}
          >
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

  return (
    <Row className="revenue_school-management_container">
      <Row>
        <Col span={24}>
          <Breadcrumb title="Doanh thu trường học" />
        </Col>
        <Col span={24}>
          <Typography.Title className="sub-revenue_title" level={5}>
            {nameSchool}
          </Typography.Title>
        </Col>
      </Row>
      <Form
        style={{ width: '100%' }}
        form={formCreate}
        layout="vertical"
        className="revenue_action-management_form mt-16 "
        onFinish={handleCreateRevenue}
      >
        <Container>
          <Row gutter={[16, 0]} justify={'start'}>
            <Col span={6}>
              <Form.Item label="Tháng/Năm" name="time" required={false} className="mb-0">
                <DatePickerUI
                  allowClear={false}
                  picker="month"
                  value={dayjs(startMonth)}
                  format={'MM/YYYY'}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số học sinh: "
                name="numberStudent"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Số học sinh không được để trống',
                  },
                ]}
              >
                <InputUI onKeyDown={(e: any) => checkKeyCode(e)} placeholder="Nhập số học sinh" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Giá tiền: "
                name="cost"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Giá tiền không được để trống',
                  },
                ]}
              >
                <InputUI onKeyDown={(e: any) => checkKeyCode(e)} placeholder="10,000/học sinh" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item style={{ opacity: 0 }} label="Giá tiền: " name="discount" required={false}>
                <InputUI style={{ cursor: 'default' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} htmlType="submit" className="btn btn-add">
                {typeValues?.type === 'edit' ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>

      <Form
        style={{ width: '100%' }}
        form={formAction}
        layout="vertical"
        className="revenue_action-management_form mt-24 "
        onFinish={handleActionRevenue}
      >
        <Container>
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <Form.Item label="Từ" name="startDate" required={false}>
                <DatePickerUI allowClear={false} picker="month" format={'MM/YYYY'} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Đến"
                name="endDate"
                required={false}
                rules={[
                  {
                    validator(_, value) {
                      const fromValue = formAction.getFieldValue('startDate');
                      if (!fromValue) {
                        return Promise.reject('Hãy tháng bắt đầu trước');
                      }
                      if (value.isBefore(fromValue)) {
                        return Promise.reject('Giá trị tháng sau không thể bé hơn tháng trước');
                      }
                      return Promise.resolve('');
                    },
                  },
                ]}
              >
                <DatePickerUI allowClear={false} picker="month" format={'MM/YYYY'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item style={{ opacity: 0 }} label="Giá tiền: " name="cost" required={false}>
                <InputUI style={{ cursor: 'default' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button icon={<SearchIcon />} htmlType="submit" className="btn btn-primary">
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
      <Container className="mt-24">
        <Table
          loading={isLoading}
          dataSource={
            listRevenue?.data?.selectedRevenue?.length > 0 ? (listRevenue?.data?.selectedRevenue[0] as never) : []
          }
          columns={columns}
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
          handleGetListRevenue(
            {
              size: tableParams?.pagination?.pageSize as number,
              page: tableParams?.pagination?.current as number,
            },
            id as never,
          )
        }
      />
    </Row>
  );
};

export default Revenue;
