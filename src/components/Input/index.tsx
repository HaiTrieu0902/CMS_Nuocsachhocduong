import { Input as AntInput, InputProps as AntInputProps, InputRef } from 'antd';
import React from 'react';

type InputProps = AntInputProps & {
  ref?: React.Ref<InputRef>;
};

export const InputUI = React.forwardRef(({ className, type, ...rest }: InputProps, ref: any) => {
  const inputClassName = `input-layout ${className ?? ''} `;
  if (type === 'password') return <AntInput.Password className={inputClassName} {...rest} />;
  return <AntInput className={inputClassName} type={type || 'text'} ref={ref} {...rest} />;
});
