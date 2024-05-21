/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/style/common.scss';
import { Row, Typography } from 'antd';

type BreadcrumbProps = {
  title: string;
  children?: React.ReactNode;
  params?: string;
};

const Breadcrumb = ({ title, children, params }: BreadcrumbProps) => {
  return (
    <Row>
      <Typography.Title className="breadcrumb_title" level={4}>
        {title}
      </Typography.Title>
    </Row>
  );
};

export default Breadcrumb;
