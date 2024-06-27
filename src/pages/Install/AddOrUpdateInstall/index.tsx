/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputUI, PlusIcon, SelectUI, XCircleIcon } from '@/components';
import { ESTATUS } from '@/constants/enum';
import useLoading from '@/hooks/useLoading';
import { IAccount } from '@/models/account.model';
import { IInstallRecord } from '@/models/install.model';
import { getListUserBySchoolAPI } from '@/services/api/account';
import { getDetailInstallAPI, updateInstallAPI } from '@/services/api/install';
import { Button, Col, Divider, Form, Modal, Row, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import './AddOrUpdateInstall.scss';

interface AddOrUpdateInstallProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
  onSuccess: () => void;
}

const AddOrUpdateInstall = ({ isActive, title, data, onCancel, onSuccess }: AddOrUpdateInstallProps) => {
  const { isLoading, withLoading } = useLoading();
  const [form] = Form.useForm();
  const [dataDetail, setDataDetail] = useState<IInstallRecord>({} as IInstallRecord);
  const [userBySchool, setUserBySchool] = useState<IAccount[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const handleCancelModal = () => {
    onCancel(false);
    form.resetFields();
    setQuantity(1);
  };

  const handleSubmit = async (values: any) => {
    await withLoading(async () => {
      try {
        const params = {
          id: data?.id,
          staffId: values?.staffId,
          warrantyPeriod: values?.warrantyPeriod,
          quantity: values?.quantity,
          totalAmount: Number(
            ((dataDetail?.product?.price as number) -
              ((dataDetail?.product?.price as number) * (dataDetail?.product?.discount as number)) / 100) *
              values?.quantity,
          ),
        };
        const res = await updateInstallAPI(params);
        onSuccess();
        handleCancelModal();
        message.success('Cập nhật hồ sơ lắp đặt thành công');
      } catch (error: any) {
        message.error(error?.message);
      }
    });
  };

  const onChangeQuantity = (e: any) => {
    setQuantity(Number(e.target.value));
  };

  useEffect(() => {
    if (data?.id) {
      const handleGetDetailInstall = async () => {
        try {
          const res = await getDetailInstallAPI(data?.id);
          setDataDetail(res?.data);
          setQuantity(res?.data?.quantity || data?.quantity);
          const userSchool = await getListUserBySchoolAPI(data?.school?.id);
          setUserBySchool(userSchool?.data);
        } catch (error: any) {
          message.error(error?.message);
        }
      };
      if (isActive) {
        handleGetDetailInstall();
      }
    }
  }, [isActive]);

  useEffect(() => {
    const initForm = {
      schoolId: dataDetail?.school?.name || data?.school?.name,
      productId: dataDetail?.product?.name || data?.product?.name,
      staffId: dataDetail?.staff?.id || data?.staff?.id,
      warrantyPeriod: dataDetail?.warrantyPeriod || data?.warrantyPeriod,
      quantity: dataDetail?.quantity || data?.quantity,
    };
    form.setFieldsValue(initForm);
  }, [dataDetail]);

  return (
    <Modal
      width={500}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">Sửa hồ sơ lắp đặt</Typography.Title>}
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-category-management__container"
    >
      <Form form={form} layout="vertical" className="addOrUpdate-management_form" onFinish={handleSubmit}>
        <Row gutter={[10, 0]}>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Form.Item label="Trường học lắp đặt: " name="schoolId" required={false}>
              <InputUI disabled placeholder="Nhập mã loại hợp đồng " />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Sản phẩm: " name="productId">
              <InputUI disabled placeholder="Nhập tên loại hợp đồng " />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Nhân viên kỹ thuật không được để trống',
                },
              ]}
              label="Nhân viên kỹ thuật: "
              name="staffId"
            >
              <SelectUI
                disabled={data?.status?.id === ESTATUS.COMPLETED || data?.status?.id === ESTATUS.COMPLETE}
                placeholder="Chọn nhân viên kỹ thuật"
                options={userBySchool?.map((item) => ({ value: item?.id, label: item?.fullName }))}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Thời gian bảo hành không được để trống',
                },
              ]}
              label="Thời gian bảo hành (Tháng): "
              name="warrantyPeriod"
            >
              <SelectUI
                disabled={data?.status?.id === ESTATUS.COMPLETED || data?.status?.id === ESTATUS.COMPLETE}
                placeholder="Chọn thời gian bảo hành"
                options={[
                  {
                    value: 12,
                    label: '12 tháng',
                  },
                  {
                    value: 24,
                    label: '24 tháng',
                  },
                  {
                    value: 36,
                    label: '36 tháng',
                  },
                  {
                    value: 48,
                    label: '48 tháng',
                  },
                  {
                    value: 60,
                    label: '60 tháng',
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Số lượng không được để trống',
                },
              ]}
              label="Số lượng :"
              name="quantity"
            >
              <InputUI
                disabled={data?.status?.id === ESTATUS.COMPLETED || data?.status?.id === ESTATUS.COMPLETE}
                type="number"
                value={quantity}
                placeholder="Nhập số lượng"
                min={1}
                max={12}
                onChange={onChangeQuantity}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row justify={'space-between'}>
              <Typography.Text className="">Tổng tiền: </Typography.Text>
              <Typography.Text className="text_danger">
                {`${Number(
                  ((dataDetail?.product?.price as number) -
                    ((dataDetail?.product?.price as number) * (dataDetail?.product?.discount as number)) / 100) *
                    quantity,
                ).toLocaleString()} `}
                VNĐ
              </Typography.Text>
            </Row>
          </Col>
          <Col span={24} className="mt-16">
            <Button
              disabled={data?.status?.id === ESTATUS.COMPLETED || data?.status?.id === ESTATUS.COMPLETE}
              loading={isLoading}
              icon={<PlusIcon />}
              htmlType="submit"
              className="btn btn-add"
            >
              Cập nhật hồ sơ lắp đặt
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default React.memo(AddOrUpdateInstall);
