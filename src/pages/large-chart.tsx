import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// Function to generate initial dataset
function generateInitialData(count: number): [number, number][] {
  const data: [number, number][] = [];
  let baseValue = Math.random() * 1000;
  const time = new Date(2020, 0, 1);
  for (let i = 0; i < count; i++) {
    time.setSeconds(time.getSeconds() + 1);
    baseValue = baseValue + Math.random() * 20 - 10;
    data.push([time.getTime(), Math.round(baseValue)]);
  }
  return data;
}

// 컴포넌트화된 LargeChart
interface LargeChartProps {
  data: [number, number][];
  title?: string;
  height?: string;
}

function LargeChart({
  data,
  title = 'Real-time Chart',
  height = '100%',
}: LargeChartProps) {
  const chartRef = useRef<InstanceType<typeof ReactECharts> | null>(null);

  // 초기 옵션을 useMemo로 고정 (data 변경되어도 재생성 안됨)
  const initialOptions = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(250,250,250,0.7)',
        borderColor: '#333',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        formatter: function (params: unknown) {
          if (Array.isArray(params)) {
            params = params[0];
          }
          const value = (params as { value: [number, number] }).value;
          if (Array.isArray(value) && value.length >= 2) {
            const date = new Date(value[0]);
            return (
              'Time: ' +
              date.toLocaleTimeString() +
              '<br/>' +
              'Value: ' +
              value[1].toFixed(2)
            );
          }
          return '';
        },
      },
      title: {
        left: 'center',
        text: title,
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
          animation: false,
          data: [], // 빈 배열로 시작
        },
      ],
    }),
    [title],
  );

  // 데이터가 변경될 때만 시리즈 업데이트 (사용자 설정 유지)
  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      chartInstance.setOption(
        {
          series: [
            {
              data: data,
            },
          ],
        },
        false, // notMerge: false로 기존 옵션 유지
      );
    }
  }, [data]);

  return (
    <ReactECharts
      ref={chartRef}
      option={initialOptions}
      style={{ height }}
      notMerge={false}
      lazyUpdate={true}
    />
  );
}

// 부모 컴포넌트
export default function LargeChartPage() {
  const [chartData, setChartData] = useState<[number, number][]>(() =>
    generateInitialData(100000),
  );
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData];

        // 1. Remove the first point
        newData.shift();

        // 2. Add a new point
        const lastDataPoint = newData[newData.length - 1];
        const newTime = new Date(lastDataPoint[0]);
        newTime.setSeconds(newTime.getSeconds() + 1);
        const newValue = lastDataPoint[1] + Math.random() * 20 - 10;
        newData.push([newTime.getTime(), Math.round(newValue)]);

        return newData;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isRealTime]);

  const handleResetData = () => {
    setChartData(generateInitialData(100000));
  };

  const toggleRealTime = () => {
    setIsRealTime((prev) => !prev);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 컨트롤 패널 */}
      <div
        style={{
          padding: '1rem',
          background: '#f5f5f5',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <button
          onClick={toggleRealTime}
          style={{
            padding: '0.5rem 1rem',
            background: isRealTime ? '#ff4757' : '#2ed573',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isRealTime ? '실시간 중지' : '실시간 시작'}
        </button>

        <button
          onClick={handleResetData}
          style={{
            padding: '0.5rem 1rem',
            background: '#3742fa',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          데이터 리셋
        </button>

        <span style={{ color: '#666' }}>
          데이터 포인트: {chartData.length.toLocaleString()}개
          {isRealTime && ' (실시간 업데이트 중...)'}
        </span>
      </div>

      {/* 차트 영역 */}
      <div style={{ flex: 1 }}>
        <LargeChart
          data={chartData}
          title={`Real-time Sliding Window Chart (${chartData.length.toLocaleString()} Points)`}
          height="100%"
        />
      </div>
    </div>
  );
}
