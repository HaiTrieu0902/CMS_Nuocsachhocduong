/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Col, Modal, Row, Typography } from 'antd';
import { memo } from 'react';
import '../../assets/style/common.scss';
import { XCircleIcon } from '../Icons';
interface ModalConfirmAccountProps {
  isActive: boolean;
  title?: string;
  data?: any;
  onCancel: (value: boolean) => void;
  onSubmit: (values: any) => void;
  onSuccess: () => void;
}

const PopupConfirm = ({
  isActive,
  title,
  data,
  onCancel,
  onSubmit,
  onSuccess,
}: ModalConfirmAccountProps) => {
  const handleCancelModal = () => {
    onCancel(false);
  };

  const handleOnSubmit = async () => {
    await onSubmit(data);
    await onSuccess();
    handleCancelModal();
  };
  return (
    <Modal
      width={400}
      footer={null}
      destroyOnClose={true}
      closeIcon={<XCircleIcon />}
      centered
      title={<Typography.Title className="title-header_modal">{`Xác nhận xóa`}</Typography.Title>}
      open={isActive}
      onCancel={handleCancelModal}
      className="modal-popup-confirm__container"
    >
      <Row gutter={[16, 12]}>
        <Col span={24}>
          <Typography.Title className="title-txt_modal">{`Bạn có chắc chắn muốn xóa ${
            data?.fullName || data?.name || data?.code || data?.title || data?.id
          }`}</Typography.Title>
        </Col>
        <Col span={12}>
          <Button onClick={handleCancelModal} className="btn btn-add">
            Hủy
          </Button>
        </Col>
        <Col span={12}>
          <Button onClick={handleOnSubmit} type="primary" className="btn btn-error">
            Xóa
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default memo(PopupConfirm);
