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
  for (let i = 0; i < 500000; i++) {
    const x = randn_bm() * 4 + 5; // 평균 5, 표준편차 4
    const y = 0.5 * x + 1.5 + randn_bm() * 1.5; // y도 정규분포 노이즈
    data.push([x, y]);
  }
  return data;
};

const largeData = generateData();

function bin2D(data: number[][], xBins: number, yBins: number): number[][] {
  // x, y 범위 계산
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const [x, y] of data) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const xStep = (maxX - minX) / xBins;
  const yStep = (maxY - minY) / yBins;
  // 빈도수 카운트용 2D 배열
  const bins: number[][] = Array.from({ length: xBins }, () =>
    Array(yBins).fill(0),
  );
  for (const [x, y] of data) {
    const xi = Math.min(Math.floor((x - minX) / xStep), xBins - 1);
    const yi = Math.min(Math.floor((y - minY) / yStep), yBins - 1);
    bins[xi][yi]++;
  }
  // ECharts heatmap용 데이터 포맷으로 변환 (category 축용)
  const result = [];
  for (let i = 0; i < xBins; i++) {
    for (let j = 0; j < yBins; j++) {
      if (bins[i][j] > 0) {
        result.push([i, j, bins[i][j]]);
      }
    }
  }
  return result;
}

const option: EChartsOption = {
  title: {
    text: 'Line and Scatter Plot with 500,000 Data Points',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: [
    {
      type: 'value',
      name: 'X-axis (Scatter)',
      position: 'bottom',
    },
    {
      type: 'category',
      name: 'X-axis (Heatmap)',
      position: 'top',
      show: false,
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Y-axis (Scatter)',
      position: 'left',
    },
    {
      type: 'category',
      name: 'Y-axis (Heatmap)',
      position: 'right',
      show: false,
    },
  ],
  visualMap: {
    min: 0,
    max: 10000,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%',
    inRange: {
      color: ['#50a3ba', '#eac736', '#d94e5d'],
    },
  },
  series: [
    {
      name: 'Density',
      type: 'heatmap',
      data: bin2D(largeData, 30, 20),
      xAxisIndex: 1,
      yAxisIndex: 1,
      z: 2,
      itemStyle: {
        opacity: 0.6,
      },
    },
    {
      name: 'Scatter',
      type: 'scatter',
      data: largeData,
      xAxisIndex: 0,
      yAxisIndex: 0,
      symbolSize: 2,
      itemStyle: {
        color: 'rgba(60,120,255,0.8)',
      },
      z: 1,
    },
  ],
  // 2D binning 함수: 데이터를 xBins * yBins 격자로 집계
};

const LineScatterPlotPage = () => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactECharts option={option} style={{ height: '100%' }} />
    </div>
  );
};

export default LineScatterPlotPage;
