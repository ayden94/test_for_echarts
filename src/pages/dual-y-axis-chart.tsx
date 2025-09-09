import type { EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef } from 'react';

// Function to generate a large dataset for two series
function generateDualAxisData(count: number) {
  const barData = [];
  const lineData = [];
  let baseValueBar = Math.random() * 1000;
  let baseValueLine = Math.random() * 500; // Different scale for line
  const time = new Date(2000, 0, 1);

  for (let i = 0; i < count; i++) {
    time.setMinutes(time.getMinutes() + 1);
    baseValueBar = baseValueBar + Math.random() * 20 - 10;
    baseValueLine = baseValueLine + Math.random() * 10 - 5;
    barData.push([time.getTime(), Math.round(baseValueBar)]);
    lineData.push([time.getTime(), Math.round(baseValueLine)]);
  }
  return { barData, lineData };
}

export default function DualYAxisChartPage() {
  const chartRef = useRef<InstanceType<typeof ReactECharts> | null>(null);

  useEffect(() => {
    const { barData, lineData } = generateDualAxisData(100000); // Initial 100,000 points

    const initialOptions: EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        left: 'center',
        text: 'Dual Y-Axis Chart (Bar & Line) with 100,000 Points',
      },
      legend: {
        data: ['Bar Series', 'Line Series'],
        left: 'center',
        top: '40px',
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'time',
        boundaryGap: [0, 0], // No boundary gap for time axis
      },
      yAxis: [
        // Two Y-axes
        {
          type: 'value',
          name: 'Bar Value',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#5470C6', // Color for left axis
            },
          },
          axisLabel: {
            formatter: '{value} units',
          },
          boundaryGap: [0, '100%'],
        },
        {
          type: 'value',
          name: 'Line Value',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#91CC75', // Color for right axis
            },
          },
          axisLabel: {
            formatter: '{value} score',
          },
          boundaryGap: [0, '100%'],
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: 'Bar Series',
          type: 'bar',
          yAxisIndex: 0, // Use the left Y-axis
          data: barData,
          animation: false,
        },
        {
          name: 'Line Series',
          type: 'line',
          yAxisIndex: 1, // Use the right Y-axis
          smooth: true,
          symbol: 'circle', // Show symbols
          symbolSize: 1, // Make symbols a bit larger for easier hovering
          data: lineData,
          animation: false,
        },
      ],
    };

    // Set initial options
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().setOption(initialOptions);
    }

    const interval = setInterval(() => {
      if (chartRef.current) {
        const echartsInstance = chartRef.current.getEchartsInstance();
        if (echartsInstance) {
          const currentOptions = echartsInstance.getOption() as EChartsOption;
          const series = currentOptions.series as SeriesOption[];
          const oldBarData = series[0].data as [number, number][];
          const oldLineData = series[1].data as [number, number][];

          const newBarData = [...oldBarData];
          const newLineData = [...oldLineData];

          // Remove the first point
          newBarData.shift();
          newLineData.shift();

          // Add a new point
          const lastBarDataPoint = oldBarData[oldBarData.length - 1] as [
            number,
            number,
          ];
          const lastLineDataPoint = oldLineData[oldLineData.length - 1] as [
            number,
            number,
          ];

          const newTime = new Date(lastBarDataPoint[0]);
          newTime.setMinutes(newTime.getMinutes() + 1);

          const newBarValue = lastBarDataPoint[1] + Math.random() * 20 - 10;
          const newLineValue = lastLineDataPoint[1] + Math.random() * 10 - 5;

          newBarData.push([newTime.getTime(), Math.round(newBarValue)]);
          newLineData.push([newTime.getTime(), Math.round(newLineValue)]);

          echartsInstance.setOption({
            series: [{ data: newBarData }, { data: newLineData }],
          });
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [chartRef]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactECharts
        ref={chartRef}
        option={{}} // Initial empty option, will be set by useEffect
        style={{ height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
