import { TooltipParagraph } from '@/components';
import { format } from 'date-fns';
import React from 'react';

interface TooltipCellProps {
  title?: string;
  content?: string;
  isDate?: boolean;
}

const TooltipCell: React.FC<TooltipCellProps> = ({ title, content, isDate }) => {
  const displayContent = isDate && content ? format(new Date(content), 'dd/MM/yyyy') : content || 'N/A';
  return (
    <TooltipParagraph placement="topLeft" title={title || displayContent}>
      {displayContent}
    </TooltipParagraph>
  );
};

export default TooltipCell;
