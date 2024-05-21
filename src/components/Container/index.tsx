import { Row } from 'antd';
import { RowProps } from 'antd/lib';

interface ContainerProps extends RowProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, gutter = 0, align, justify, wrap, className }: ContainerProps) => {
  return (
    <Row align={align} wrap={wrap} justify={justify} gutter={gutter} className={`container-layout ${className}`}>
      {children}
    </Row>
  );
};

export default Container;
