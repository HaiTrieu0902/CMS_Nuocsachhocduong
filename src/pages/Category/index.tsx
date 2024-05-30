/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PencilIcon, PlusIcon, SearchIcon, TooltipCell, TrashIcon } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE, defaultTableParams } from '@/constants';
import useLoading from '@/hooks/useLoading';
import useModal from '@/hooks/useModal';
import { IDataCommon, IGetListParamCommon, TableParams } from '@/models/common.model';
import { getListCategoryAPI } from '@/services/api/category';
import { useModel } from '@umijs/max';
import { Button, Col, Form, Row, Table, TableColumnsType, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AddOrUpdateCategory from './AddOrUpdateCategory';
import './Category.scss';

const CategoryManagement: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const {
    stateModal: editOrAddCategoryState,
    toggleModal: toggleEditOrAddCategoryModal,
    offModal: offEditOrAddMaintainModal,
  } = useModal();
  const [listCategory, setListCategory] = useState<IDataCommon[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: defaultTableParams,
  });
  const [searchParams, setSearchParams] = useState<IGetListParamCommon>({
    size: DEFAULT_SIZE_PAGE,
    page: DEFAULT_PAGE_NUMBER,
    search: '',
  });

  /** handle ToggleModal */
  const handleToggleModal = () => {
    toggleEditOrAddCategoryModal(true, 'add', {})();
  };

  /** handle submit */
  const handleSubmit = async (values: any) => {
    setSearchParams({
      size: DEFAULT_SIZE_PAGE,
      page: DEFAULT_PAGE_NUMBER,
      search: values?.search?.trim() || '',
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

  /** handle get list product */
  const handleGetListCategory = async (values: IGetListParamCommon) => {
    await withLoading(async () => {
      try {
        const res = await getListCategoryAPI(values);
        setListCategory(res?.data[0]);
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

  /** config data */
  const columns: TableColumnsType<IDataCommon> = [
    {
      title: 'STT',
      key: 'stt',
      width: '8%',
      render: (text, row, index) => {
        return <TooltipCell content={(index + 1).toString()} />;
      },
    },
    {
      title: 'Mã phân loại sản phẩm',
      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.id} content={row?.id} />;
      },
    },
    {
      title: 'Loại sản phẩm',

      width: '15%',
      render: (text, row) => {
        return <TooltipCell title={row?.name} content={row?.name} />;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text: any, row: any) => (
        <Row gutter={[8, 10]}>
          <Col>
            <PencilIcon />
          </Col>
          <Col>
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
    handleGetListCategory(searchParams);
  }, [searchParams]);

  useEffect(() => {
    setInitialState((s: any) => ({
      ...s,
      data: 'LOẠI SẢN PHẨM',
    }));
  });

  return (
    <Row className="category-management_container">
      <Breadcrumb title="Loại sản phẩm" />
      <Container>
        <Form form={form} layout="vertical" className="category-management_form" onFinish={handleSubmit}>
          <Row gutter={[10, 0]}>
            <Col span={5}>
              <Form.Item label="Từ khóa tìm kiếm" name="search" required={false}>
                <InputUI placeholder="Mã hoặc tên loại sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={18}></Col>
            <Col span={3}>
              <Button icon={<SearchIcon />} className="btn btn-primary" key="submit" htmlType="submit">
                Tìm kiếm
              </Button>
            </Col>
            <Col span={4}>
              <Button icon={<PlusIcon />} onClick={handleToggleModal} className="btn btn-add">
                Thêm loại sản phẩm
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="mt-24">
        <Table
          loading={isLoading}
          dataSource={listCategory ? (listCategory as never) : []}
          columns={columns}
          locale={{ emptyText: 'Chưa có dữ liệu' }}
          scroll={{ y: '60vh' }}
          showSorterTooltip={false}
          onChange={handleTableChange}
          pagination={tableParams.pagination}
        />
      </Container>
      <AddOrUpdateCategory
        onCancel={offEditOrAddMaintainModal}
        isActive={editOrAddCategoryState.open}
        data={editOrAddCategoryState?.data}
        onSuccess={() =>
          handleGetListCategory({
            size: tableParams?.pagination?.pageSize as number,
            page: tableParams?.pagination?.current as number,
          })
        }
      />
    </Row>
  );
};

export default React.memo(CategoryManagement);
