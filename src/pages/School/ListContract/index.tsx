/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  CodeIcon,
  Container,
  DatePickerUI,
  InputUI,
  PlusIcon,
  SelectUI,
  TooltipCell,
} from '@/components';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SIZE_PAGE,
  DEFAULT_SIZE_PAGE_MAX,
  defaultTableParams,
} from '@/constants';
import { BASE_URL } from '@/constants/urls';
import useLoading from '@/hooks/useLoading';
import { TableParams } from '@/models/common.model';
import { getListCategoryAPI } from '@/services/api/category';
import { uploadFilesApi } from '@/services/api/common';
import {
  IContract,
  ICreateContractParams,
  IGetListContractParams,
  createContractAPI,
  getListContractAPI,
} from '@/services/api/contract';
import { allowedFormatsDocument } from '@/utils/common';
import { useParams } from '@umijs/max';
import {
  Button,
  Col,
  Flex,
  Form,
  Row,
  Spin,
  Table,
  TableColumnsType,
  Typography,
  Upload,
  UploadProps,
  message,
} from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { DatePickerProps, UploadFile } from 'antd/lib';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import '../School.scss';
import './styles.scss';

interface FormValues {
  code: string;
  signDate: string;
  categoryContractId: string;
}

const ListContractSchool = () => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());
  const [fileData, setFileData] = useState<UploadFile[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const { id } = useParams<{ id: string }>();

  const [contractCategories, setContractCategories] = useState([]);
  const [contracts, setContracts] = useState<IContract[]>([]);

  const [searchParams, setSearchParams] = useState<IGetListContractParams>({
    size: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    schoolId: id as string,
  });

  const { isLoading, withLoading } = useLoading();

  const fetchContractCategories = () => {
    withLoading(async () => {
      const response = await getListCategoryAPI({
        page: DEFAULT_PAGE_NUMBER,
        size: DEFAULT_SIZE_PAGE_MAX,
        type: 'contract',
      });
      setContractCategories(response.data[0].map((i: any) => ({ label: i.name, value: i.id })));
    });
  };

  const fetchContracts = (params: IGetListContractParams) => {
    withLoading(async () => {
      const response = await getListContractAPI(params);
      setContracts(response[0]);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: params.page,
          total: response[1],
        },
      });
    });
  };

  useEffect(() => {
    if (id) {
      Promise.all([fetchContractCategories(), fetchContracts(searchParams)]);
    }
  }, [searchParams, id]);

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

  const handleDateChange: DatePickerProps['onChange'] = (date: any, name) => {
    setStartDate(date);
    console.log('date', date);
  };

  const handleFileChange = (info: UploadChangeParam) => {
    if (info.file && allowedFormatsDocument.includes(info?.file?.type as string)) {
      setFileData((res) => [...res, info.file]);
      message.success(`${info.file.name} file uploaded successfully`);
    }
  };

  const handleAddContract = (values: FormValues) => {
    if (
      !fileData.length &&
      fileData.every((file) => allowedFormatsDocument.includes(file.type as string))
    ) {
      return message.error('File hợp đồng không hợp lệ!');
    }
    withLoading(async () => {
      try {
        const uploadedFiles = await uploadFilesApi(fileData as unknown as File[]);

        const params: ICreateContractParams = {
          ...values,
          schoolId: id as string,
          files: uploadedFiles,
        };
        await createContractAPI(params);
        form.resetFields();
        setFileData([]);
        message.success('Thêm hợp đồng thành công!');
      } catch (error: any) {
        message.error(error?.message || 'Thất bại');
      } finally {
        fetchContracts(searchParams);
      }
    });
  };

  const props: UploadProps = {
    fileList: fileData,
    multiple: true,
    beforeUpload: (file: any) => {
      const isAllowed = allowedFormatsDocument.includes(file.type);
      if (!isAllowed) {
        message.error('Bạn chỉ upload được file doc, docx, pdf, txt !');
      } else if (file?.size / 1024 / 1024 > 5) {
        message.error('file không lớn quá 20mb!');
      } else {
        form.setFieldsValue({ thumbnail: file?.name });
        return false;
      }
    },
    onRemove: (file) => setFileData((res) => res.filter((i) => i !== file)),
    onChange: handleFileChange,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const columns: TableColumnsType<IContract> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: '8%',
      render: (_, __, index) => {
        return <TooltipCell content={`${(index + 1).toString()}`} />;
      },
    },
    {
      title: 'Mã hợp đồng',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
    },
    {
      title: 'Ngày ký hợp đồng',
      dataIndex: 'signDate',
      width: '15%',
      key: 'signDate',
      render: (_, row) => {
        return <TooltipCell title={row?.signDate} content={row?.signDate} isDate />;
      },
    },
    {
      title: 'Loại hợp đồng',
      dataIndex: 'category',
      key: 'category',
      render: (_, row) => {
        return <TooltipCell title={row?.category.name} content={row?.category.name} />;
      },
    },
    {
      title: 'Danh sách file hợp đồng',
      dataIndex: 'files',
      key: 'files',
      render: (files) => {
        return (
          <Flex gap={16} wrap="wrap">
            {files.map((file: any) => (
              <a
                href={BASE_URL + file.url}
                target="_blank"
                className="file-item"
                key={file.id}
                rel="noreferrer"
              >
                {file.url.replace('/uploads/file/', '')}
              </a>
            ))}
          </Flex>
        );
      },
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      className="school-management_form "
      onFinish={handleAddContract}
    >
      <Row className="invest-management_container">
        <div className="invest-header-management">
          <Breadcrumb title={'Danh sách hợp đồng'} />
          <Row>
            <Button icon={<PlusIcon />} className="btn btn-add" htmlType="submit" key="submit">
              Thêm hợp đồng
            </Button>
          </Row>
        </div>

        <Container className="mt-24">
          <Row gutter={[16, 10]}>
            <Col span={5}>
              <Form.Item
                label="Mã hợp đồng"
                name="code"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Mã hợp đồng không được để trống',
                  },
                ]}
              >
                <InputUI placeholder="Nhập mã hợp đồng" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label="Tháng/Năm"
                name="signDate"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Ngày ký hợp đồng không được để trống',
                  },
                ]}
              >
                <DatePickerUI
                  allowClear={false}
                  picker="date"
                  value={dayjs(startDate)}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                label="Phân loại hợp đồng"
                rules={[
                  {
                    required: true,
                    message: 'Loại hợp đồng không được để trống',
                  },
                ]}
                name="categoryContractId"
                required={false}
              >
                <SelectUI options={contractCategories} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Upload {...props} style={{ width: '100%' }}>
                <Row
                  justify={'center'}
                  style={{ gap: 6, alignItems: 'center' }}
                  className="pointer"
                >
                  <CodeIcon />{' '}
                  <Typography.Text className="txt_contract">File hợp đồng</Typography.Text>
                </Row>
              </Upload>
            </Col>
          </Row>
        </Container>

        <Container className="mt-24">
          <Spin spinning={isLoading}>
            <Table
              dataSource={contracts}
              columns={columns}
              pagination={tableParams.pagination}
              onChange={handleTableChange}
              scroll={{ y: '350px' }}
              locale={{ emptyText: 'Chưa có dữ liệu' }}
              showSorterTooltip={false}
            />
          </Spin>
        </Container>
      </Row>
    </Form>
  );
};

export default ListContractSchool;
