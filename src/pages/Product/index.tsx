/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Breadcrumb,
  Container,
  InputUI,
  PencilIcon,
  PlusIcon,
  PopupConfirm,
  SearchIcon,
  SelectUI,
  TooltipCell,
  TrashIcon,
} from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, DEFAULT_SIZE_PAGE_MAX, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IDataCommon, TableParams } from '@/models/common.model';
import { IGetListParamProduct, IProduct } from '@/models/product.model';
import { getListCategoryAPI } from '@/services/api/category';
import { deleteProductAPI, getListProductAPI } from '@/services/api/product';
import { history } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './Product.scss';

const ProductManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const [listCategory, setListCategory] = useState<IDataCommon[]>();
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const { stateModal: confirmState, toggleModal: toggleConfirmModal, offModal: offConfirmModal } = useModal();

  const [searchParams, setSearchParams] = useState<IGetListParamProduct>({
    pageSize: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
    categoryProductId: '',
  });

  /** handle navigator */
  const handleNavigator = (id: string | null) => {
    if (id) {
      history.push(`/products/${id}`);
    } else {
      history.push(`/products/create`);
    }
  };

  /** handle get list product */
  const handleGetListProduct = async (values: IGetListParamProduct) => {
    await withLoading(async () => {
      try {
        const res = await getListProductAPI(values);
        setListProduct(res?.data);
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

  /** handle submit */
  const handleSubmitSearchProduct = async (values: any) => {
    setSearchParams({
      pageSize: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
      categoryProductId: values?.categoryId || '',
    });
  };

  /** handleOnSubmitDelete */
  const handleOnSubmitDelete = async (row: IProduct) => {
    try {
      if (row?.id) await deleteProductAPI(row?.id);
      message.success('Xóa sản phẩm thành công');
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  /** onChange  */
  const onChangeValueSearch = (e: any) => {
    // handleGetListProduct({
    //   size: DEFAULT_SIZE_PAGE,
    //   page: DEFAULT_PAGE_NUMBER,
    //   search: e?.target?.value || '',
    // });
  };

  /** config data */
  const columns: TableColumnsType<IProduct> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      align: 'right',
      render: (text, row, index) => {
        return <TooltipCell content={`${(index + 1).toString()}`} />;
      },
    },
    {
      title: 'Mã sản phẩm',
      key: 'code',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.code} content={row?.code} />;
      },
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.name} content={row?.name} />;
      },
    },
    {
      title: 'Loại sản phẩm',
      key: 'name',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.categoryProduct?.name} content={row?.categoryProduct?.name || ''} />;
      },
    },
    {
      title: 'Giá gốc(VNĐ)',
      key: 'name',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={Number(row?.price).toLocaleString()}
            content={Number(row?.price).toLocaleString() || ''}
          />
        );
      },
    },

    {
      title: '% Giảm giá',
      key: 'name',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.discount?.toLocaleString()} content={row?.discount?.toLocaleString() || ''} />;
      },
    },

    {
      title: 'Giá tiền(VNĐ)',
      key: 'name',
      width: '15%',
      render: (text, row) => {
        return (
          <TooltipCell
            title={Number(row?.price - (row?.price * row?.discount) / 100).toLocaleString()}
            content={`${Number(row?.price - (row?.price * row?.discount) / 100).toLocaleString()} `}
          />
        );
      },
    },

    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (text: any, row) => (
        <Row gutter={[8, 10]} justify={'center'}>
          <Col className="pointer" onClick={() => handleNavigator(row?.id || '')}>
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

  /** Use Effect */
  useEffect(() => {
    const handleGetListCategory = async () => {
      try {
        const res = await getListCategoryAPI({
          pageSize: DEFAULT_SIZE_PAGE_MAX,
          page: DEFAULT_PAGE_NUMBER,
        });
        setListCategory(res?.data);
      } catch (error: any) {
        message.error(error?.message);
      }
    };
    handleGetListCategory();
  }, []);

  useEffect(() => {
    handleGetListProduct(searchParams);
  }, [searchParams]);

  return (
    <Row className="product-management_container">
      <Breadcrumb title="Sản phẩm" />
      <Container>
        <Form form={form} layout="vertical" className="product-management_form " onFinish={handleSubmitSearchProduct}>
          <Row gutter={[16, 0]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="search" required={false}>
                <InputUI allowClear onChange={onChangeValueSearch} placeholder="Mã hoặc tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Loại sản phẩm" name="categoryId" required={false}>
                <SelectUI
                  // defaultValue={''}
                  showSearch
                  placeholder="Loại sản phẩm"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                  }
                  // filterSort={(optionA: any, optionB: any) =>
                  //   (optionA?.label?.toLowerCase() ?? '').localeCompare(optionB?.label?.toLowerCase())
                  // }
                  options={[
                    { value: '', label: 'Tất cả' },
                    ...(listCategory?.map((item) => ({
                      value: item?.id,
                      label: item?.name,
                    })) ?? []),
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={14}></Col>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} onClick={() => handleNavigator(null)} className="btn btn-add">
                Thêm sản phẩm
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Container className="mt-24">
        <Table
          dataSource={listProduct.length > 0 ? (listProduct as never) : []}
          columns={columns}
          rowKey={(record: any) => record?.id}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          loading={isLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          showSorterTooltip={false}
        />
      </Container>
      <PopupConfirm
        onCancel={offConfirmModal}
        isActive={confirmState.open}
        data={confirmState?.data}
        onSubmit={handleOnSubmitDelete}
        onSuccess={() =>
          handleGetListProduct({
            pageSize: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
            search: searchParams?.search,
          })
        }
      />
    </Row>
  );
};

export default React.memo(ProductManagement);
