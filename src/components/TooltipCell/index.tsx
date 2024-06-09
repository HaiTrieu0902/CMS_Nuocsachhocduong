import { TooltipParagraph } from '@/components';
import { format } from 'date-fns';
import React from 'react';

interface TooltipCellProps {
  title?: string;
  content?: string;
  isDate?: boolean;
  className?: string;
  formatDate?: string;
}

const TooltipCell: React.FC<TooltipCellProps> = ({
  title,
  content,
  isDate,
  className,
  formatDate,
}) => {
  const displayContent =
    isDate && content ? format(new Date(content), formatDate ?? 'dd/MM/yyyy') : content || 'N/A';
  return (
    <TooltipParagraph placement="topLeft" title={title || displayContent} className={className}>
      {displayContent}
    </TooltipParagraph>
  );
};

export default TooltipCell;
