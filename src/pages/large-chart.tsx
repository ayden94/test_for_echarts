import type { EChartsOption, SeriesOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef } from 'react';

// Function to generate initial dataset
function generateInitialData(count: number) {
  const data = [];
  let baseValue = Math.random() * 1000;
  const time = new Date(2020, 0, 1);
  for (let i = 0; i < count; i++) {
    time.setSeconds(time.getSeconds() + 1);
    baseValue = baseValue + Math.random() * 20 - 10;
    data.push([time.getTime(), Math.round(baseValue)]);
  }
  return data;
}

const initialData = generateInitialData(100000);

const initialOptions = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.7)', // Semi-transparent dark background
    borderColor: '#333', // Dark border
    borderWidth: 1,
    padding: [10, 15], // Top/bottom, left/right padding
    textStyle: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    // formatter: function (params) { 타입 에러 잡고서 다시 시도
    //   if (Array.isArray(params)) {
    //     params = params[0];
    //     const date = new Date(params.value[0]);
    //     return (
    //       'Time: ' +
    //       date.toLocaleTimeString() +
    //       '<br/>' +
    //       'Value: ' +
    //       params.value[1].toFixed(2)
    //     );
    //   } else {
    //     const date = new Date(params.value[0]);
    //     return (
    //       'Time: ' +
    //       date.toLocaleTimeString() +
    //       '<br/>' +
    //       'Value: ' +
    //       params.value[1].toFixed(2)
    //     );
    //   }
    // },
  },
  title: {
    left: 'center',
    text: 'Real-time Sliding Window Chart (100000 Points)',
  },
  legend: {
    data: ['Real-time Data'],
    left: 'center',
    top: '40px',
    textStyle: { fontSize: 14, fontWeight: 'bold' },
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
    boundaryGap: [0, 0],
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      name: 'Real-time Data',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: initialData,
    },
  ],
} satisfies EChartsOption;

export default function LargeChartPage() {
  const chartRef = useRef<InstanceType<typeof ReactECharts> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (chartRef.current) {
        const echartsInstance = chartRef.current.getEchartsInstance();
        if (echartsInstance) {
          const currentOptions = echartsInstance.getOption() as EChartsOption;
          console.log(currentOptions);
          const oldData = (currentOptions.series as SeriesOption[])[0].data as [
            number,
            number,
          ][];
          const newData = [...oldData];

          // 1. Remove the first point
          newData.shift();

          // 2. Add a new point
          const lastDataPoint = oldData[oldData.length - 1];
          const newTime = new Date(lastDataPoint[0]);
          newTime.setSeconds(newTime.getSeconds() + 1);
          const newValue = lastDataPoint[1] + Math.random() * 20 - 10;
          newData.push([newTime.getTime(), Math.round(newValue)]);

          echartsInstance.setOption({
            series: [
              {
                data: newData,
                animation: false, // Keep animation false for smooth sliding
              },
            ],
          });
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [chartRef]); // Depend on chartRef

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactECharts
        ref={chartRef}
        option={initialOptions}
        style={{ height: '100%' }}
        // opts={{ renderer: 'canvas' }}  type opts = { renderer?: "canvas" | "svg" | undefined }
      />
    </div>
  );
}
