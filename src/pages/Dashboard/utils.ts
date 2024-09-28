import { Chart, TooltipItem, TooltipModel } from 'chart.js';

export function formatVietnameseCurrency(amount: number): string {
  const [integerPart] = amount.toFixed(2).split('.');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedIntegerPart}`;
}

function getOrCreateTooltip(chart: Chart<'line'>) {
  let tooltipEl = chart?.canvas?.parentNode?.querySelector('#tooltip') as HTMLDivElement;

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('id', 'tooltip');
    tooltipEl.style.minWidth = '120px';
    tooltipEl.style.background = 'transparent';
    tooltipEl.style.color = 'red';
    tooltipEl.style.fontSize = '10px';
    tooltipEl.style.opacity = '0';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .0001s';
    tooltipEl.style.padding = '0px 16px';
    tooltipEl.className = 'tooltip';

    const tooltipWrapper = document.createElement('div');
    tooltipWrapper.style.margin = '0px';

    tooltipEl.appendChild(tooltipWrapper);
    chart?.canvas?.parentNode?.appendChild(tooltipEl);
  }

  return tooltipEl;
}

function renderPriceEl(priceEl: HTMLDivElement, dataPoint: TooltipItem<'line'>) {
  priceEl.style.lineHeight = '130%';
  priceEl.style.color = '#FFFFFF';
  priceEl.style.fontSize = '12px';
  priceEl.style.fontWeight = '700';
  const text = document.createTextNode(`${formatVietnameseCurrency(Number(dataPoint.raw))}`);
  priceEl.appendChild(text);
}

export function externalTooltipHandler(args: { chart: Chart<'line'>; tooltip: TooltipModel<'line'> }) {
  const { chart, tooltip } = args;

  const tooltipEl = getOrCreateTooltip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  if (tooltip.body) {
    const dataPoints: TooltipItem<'line'>[] = tooltip.dataPoints || [];

    const priceEl = document.createElement('div');

    const topContent = document.createElement('div');
    topContent.style.fontSize = '10px';
    topContent.style.display = 'flex';
    topContent.style.alignItems = 'end';
    topContent.style.justifyContent = 'center';
    topContent.style.backgroundColor = '#4880FF';
    topContent.style.borderRadius = '2px';
    topContent.style.padding = '4px 8px';
    topContent.style.position = 'relative';

    const tooltipArrow = document.createElement('div');
    tooltipArrow.style.position = 'absolute';
    tooltipArrow.style.bottom = '-5px';
    tooltipArrow.style.left = '50%';
    tooltipArrow.style.transform = 'translateX(-50%)';
    tooltipArrow.style.backgroundColor = 'transparent';
    tooltipArrow.style.width = '0';
    tooltipArrow.style.height = '0';
    tooltipArrow.style.borderLeft = '5px solid #FFFFFF';
    tooltipArrow.style.borderRight = '5px solid #FFFFFF';
    tooltipArrow.style.borderTop = '5px solid #4880FF';

    // show price of gold in tooltip
    dataPoints.forEach((dataPoint) => {
      renderPriceEl(priceEl, dataPoint);
    });

    const date = document.createElement('div');
    date.style.lineHeight = '1';

    const tooltipSection = tooltipEl.querySelector('div') as HTMLTableElement;

    // Remove old children
    while (tooltipSection.firstChild) {
      tooltipSection.firstChild.remove();
    }

    // Add new children
    topContent.appendChild(priceEl);
    topContent.appendChild(tooltipArrow);
    tooltipSection.appendChild(topContent);
    tooltipSection.appendChild(date);
  }

  const { offsetTop } = chart.canvas;

  tooltipEl.style.opacity = '1';

  tooltipEl.style.left = tooltip?.caretX + 'px';
  tooltipEl.style.top = tooltip?.caretY + offsetTop - 40 + 'px';
}

export function generateRandomNumbers(count: number = 1000): number[] {
  const randomNumbers: number[] = [];

  for (let i = 0; i < count; i++) {
    // Generate a random number between 0 (inclusive) and 1 (exclusive)
    const randomNumber = Math.random() * 100000000 + 1;
    randomNumbers.push(randomNumber);
  }

  return randomNumbers;
}

export function generateNextTenYears(): { value: number; label: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { value: number; label: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const year = currentYear - i;
    years.push({
      value: year,
      label: `${year}`,
    });
  }

  return years;
}

/////////////////////////// REPORT /////////////////////////////////

export const headerStyle = {
  fill: { fgColor: { rgb: '0e8449' } },
  font: { bold: true, color: { rgb: 'FFFFFF' } },
  border: {
    top: { style: 'thin', color: { rgb: '3666c1' } },
    bottom: { style: 'thin', color: { rgb: '3666c1' } },
    left: { style: 'thin', color: { rgb: '3666c1' } },
    right: { style: 'thin', color: { rgb: '3666c1' } },
  },
  alignment: { horizontal: 'center', vertical: 'center' },
};

export const rowStyle = {
  fill: { fgColor: { rgb: '89c7ff' } },
  border: {
    top: { style: 'thin', color: { rgb: '3666c1' } },
    bottom: { style: 'thin', color: { rgb: '3666c1' } },
    left: { style: 'thin', color: { rgb: '3666c1' } },
    right: { style: 'thin', color: { rgb: '3666c1' } },
  },
};

export const alternateRowStyle = {
  fill: { fgColor: { rgb: 'FFFFFF' } },
  border: {
    top: { style: 'thin', color: { rgb: '3666c1' } },
    bottom: { style: 'thin', color: { rgb: '3666c1' } },
    left: { style: 'thin', color: { rgb: '3666c1' } },
    right: { style: 'thin', color: { rgb: '3666c1' } },
  },
};

export const totalStyle = {
  fill: { fgColor: { rgb: '0e8449' } },
  font: { bold: true, color: { rgb: 'FFFFFF' } },
  border: {
    top: { style: 'thin', color: { rgb: '3666c1' } },
    bottom: { style: 'thin', color: { rgb: '3666c1' } },
    left: { style: 'thin', color: { rgb: '0e8449' } },
    right: { style: 'thin', color: { rgb: '0e8449' } },
  },
};



