import { DataChart } from '@/services/api/dashboard';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  Plugin,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip,
} from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { externalTooltipHandler, formatVietnameseCurrency } from './utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface IChart {
  dataChart: DataChart[];
}

const Chart = ({ dataChart }: IChart) => {
  const data: ChartData<'line'> = useMemo(() => {
    const labels = Array.from(new Array(12)).map((_, index) => `Tháng ${index + 1}`);
    const revenue = Array.from(new Array(12)).map((_, index) => {
      let result = 0;
      dataChart.forEach((d) => {
        if (d.month === index + 1) {
          result = d.total;
        }
      });
      return result;
    });

    return {
      labels: labels,
      datasets: [
        {
          label: '',
          data: revenue,
          tension: 0,
          fill: 'stack',
          borderColor: '#4379EE',

          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(67, 121, 238, 0.16)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
            return gradient;
          },
          segment: {
            borderWidth: 2,
          },
          pointBorderColor: '#4880FF',
          pointBackgroundColor: '#4880FF',
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [dataChart]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      filler: {
        propagate: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          count: 5,
          callback: function (value) {
            return value ? `${formatVietnameseCurrency(Number(value))}` : 0;
          },
        },
        beginAtZero: true,
      },
    },
  };

  const plugins: Plugin<'line', AnyObject>[] = [
    {
      id: 'annotationLine',
    },
  ];

  return (
    <div id="chart-wrapper">
      <Line
        options={options}
        data={data}
        plugins={plugins}
        style={{ cursor: 'pointer', width: '100%' }}
      />
    </div>
  );
};

export default Chart;
