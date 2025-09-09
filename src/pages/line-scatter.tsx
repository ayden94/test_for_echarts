import ReactECharts, { EChartsOption } from 'echarts-for-react';

// Function to generate 10,000 data points
function randn_bm() {
  // Box-Muller transform
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const generateData = () => {
  const data = [];
  for (let i = 0; i < 5000; i++) {
    const x = randn_bm() * 4 + 5; // 평균 5, 표준편차 4
    const y = 0.5 * x + 1.5 + randn_bm() * 1.5; // y도 정규분포 노이즈
    data.push([x, y]);
  }
  return data;
};

const largeData = generateData();

// 최소제곱법으로 추세선(회귀선) 계산
function getRegressionLine(data: number[][]) {
  const n = data.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  let minX = Infinity,
    maxX = -Infinity;
  for (const [x, y] of data) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  }
  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - a * sumX) / n;
  return {
    a,
    b,
    minX,
    maxX,
    line: [
      [minX, a * minX + b],
      [maxX, a * maxX + b],
    ],
  };
}

const regression = getRegressionLine(largeData);

const option: EChartsOption = {
  title: {
    text: 'Line and Scatter Plot with 10,000 Data Points',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    type: 'value',
    name: 'X-axis',
  },
  yAxis: {
    type: 'value',
    name: 'Y-axis',
  },
  series: [
    {
      name: 'Scatter',
      type: 'scatter',
      data: largeData,
      symbolSize: 3,
      itemStyle: {
        color: 'rgba(60,120,255,0.7)',
      },
      z: 2,
    },
    {
      name: 'Regression',
      type: 'line',
      data: regression.line,
      showSymbol: false,
      lineStyle: {
        width: 3,
        color: '#ff7f0e',
      },
      z: 5,
      tooltip: { show: false },
    },
  ],
};

const LineScatterPlotPage = () => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactECharts option={option} style={{ height: '100%' }} />
    </div>
  );
};

export default LineScatterPlotPage;
