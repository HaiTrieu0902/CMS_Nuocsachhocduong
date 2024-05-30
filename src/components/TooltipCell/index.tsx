import { TooltipParagraph } from '@/components';
import { format } from 'date-fns';
import React from 'react';

interface TooltipCellProps {
  title?: string;
  content?: string;
  isDate?: boolean;
  className?: string;
}

const TooltipCell: React.FC<TooltipCellProps> = ({ title, content, isDate, className }) => {
  const displayContent = isDate && content ? format(new Date(content), 'dd/MM/yyyy') : content || 'N/A';
  return (
    <TooltipParagraph placement="topLeft" title={title || displayContent} className={className}>
      {displayContent}
    </TooltipParagraph>
  );
};

export default TooltipCell;
