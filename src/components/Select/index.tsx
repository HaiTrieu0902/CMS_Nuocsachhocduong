import { Select as AntSelect, SelectProps } from 'antd';
type IProps = SelectProps;
export const SelectUI = ({ className, ...rest }: IProps) => {
  return (
    <AntSelect
      className={`select-layout ${className ?? ''}`}
      // suffixIcon={<ArrowDownIcon />}
      notFoundContent="Danh sách trống!"
      filterOption={(inputValue, option) => {
        return (option?.label ?? '').toString().toLowerCase().includes(inputValue.toLowerCase());
      }}
      {...rest}
    />
  );
};
