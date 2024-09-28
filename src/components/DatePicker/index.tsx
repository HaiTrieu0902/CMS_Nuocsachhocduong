/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePicker as AntDatePicker, DatePickerProps } from 'antd';
import locale from 'antd/es/locale/vi_VN';

type IProps = {
  isShowIcon?: boolean;
} & DatePickerProps;

export const DatePickerUI = (props: IProps) => {
  const { className, isShowIcon = true, ...rest } = props;
  const datePickerClassName = `datepicker-layout ${className ?? ''} `;

  return (
    <AntDatePicker
      className={datePickerClassName}
      locale={locale as any} // Set locale to English
      // {...(isShowIcon && {
      //   suffixIcon: <CalendarIcon />,
      // })}
      format={'DD/MM/YYYY'}
      {...rest}
    />
  );
};
