/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tooltip } from 'antd';
import React, { useState } from 'react';

const TooltipParagraph: React.FC<any> = ({
  color,
  textAlign,
  className,
  width,
  placement,
  children,
  ellipsis,
  ...props
}) => {
  const [truncated, setTruncated] = useState(false);
  return (
    <Tooltip placement={placement} title={children}>
      <p style={{ width: width ? width : '100%', color: color, textAlign: textAlign, margin: 0 }} className={className}>
        <>{children}</>
      </p>
    </Tooltip>
  );
};

export default TooltipParagraph;
