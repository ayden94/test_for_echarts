import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useEffect, useState } from 'react';

const initialOptions = {
  grid: { top: 8, right: 8, bottom: 24, left: 36 },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'bar',
      smooth: true,
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
} satisfies EChartsOption;

export default function Home() {
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    const interval = setInterval(() => {
      setOptions((prevOptions) => {
        const newXAxisData = [...prevOptions.xAxis.data];
        const newSeriesData = [...prevOptions.series[0].data];

        // Remove the first data point
        newXAxisData.shift();
        newSeriesData.shift();

        // Add a new data point
        const now = new Date();
        newXAxisData.push(now.toLocaleTimeString().replace(/^\D*/, ''));
        newSeriesData.push(Math.round(Math.random() * 1000));

        return {
          ...prevOptions,
          xAxis: {
            ...prevOptions.xAxis,
            data: newXAxisData,
          },
          series: [
            {
              ...prevOptions.series[0],
              data: newSeriesData,
            },
          ],
        };
      });
    }, 1000); // 1 second

    return () => clearInterval(interval);
  }, []);

  return <ReactECharts option={options} />;
}
