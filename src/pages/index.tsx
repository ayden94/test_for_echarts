import Link from 'next/link';
import { useState } from 'react';

const chartPages = [
  {
    path: '/bar-chart',
    title: 'Bar Chart',
    description:
      '기본적인 막대 차트 예제입니다. 카테고리별 데이터를 시각화할 때 사용됩니다.',
    features: ['카테고리별 데이터', '애니메이션 효과', '툴팁'],
  },
  {
    path: '/large-chart',
    title: 'Large Dataset Chart',
    description:
      '대용량 데이터(300,000개 포인트)를 실시간으로 스트리밍하는 차트입니다.',
    features: [
      '실시간 데이터 스트리밍',
      '300,000개 데이터 포인트',
      '성능 최적화',
      'DataZoom',
    ],
  },
  {
    path: '/mixed-chart',
    title: 'Mixed Chart',
    description:
      '여러 차트 타입(선, 막대, 영역)을 하나의 차트에 조합한 복합 차트입니다.',
    features: ['복합 차트 타입', '선/막대/영역 차트', '다양한 시각화'],
  },
  {
    path: '/dual-y-axis-chart',
    title: 'Dual Y-Axis Chart',
    description:
      '서로 다른 스케일의 데이터를 하나의 차트에 표시하는 이중 Y축 차트입니다.',
    features: ['이중 Y축', '다중 데이터 시리즈', '서로 다른 스케일'],
  },
  {
    path: '/line-scatter',
    title: 'Line & Scatter Plot',
    description:
      '산점도와 추세선을 함께 표시하는 차트입니다. 데이터의 분포와 상관관계를 분석할 수 있습니다.',
    features: [
      '산점도',
      '회귀선(추세선)',
      '정규분포 데이터',
      '타입 안전한 툴팁',
    ],
  },
  {
    path: '/den-scatter',
    title: 'Density Heatmap + Scatter',
    description:
      '히트맵과 산점도를 결합한 밀도 시각화 차트입니다. 데이터가 집중된 영역을 색상으로 표현합니다.',
    features: ['2D 히트맵', '산점도 오버레이', '이중 축 시스템', '밀도 시각화'],
  },
];

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            color: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            ECharts Examples
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            React + ECharts를 활용한 다양한 데이터 시각화 예제들을 살펴보세요
          </p>
        </div>

        {/* Chart Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {chartPages.map((chart, index) => (
            <Link
              key={chart.path}
              href={chart.path}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  height: '300px',
                  boxShadow:
                    hoveredCard === index
                      ? '0 20px 40px rgba(0,0,0,0.2)'
                      : '0 10px 30px rgba(0,0,0,0.1)',
                  transform:
                    hoveredCard === index
                      ? 'translateY(-5px)'
                      : 'translateY(0)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    color: '#333',
                    borderBottom: '2px solid #667eea',
                    paddingBottom: '0.5rem',
                  }}
                >
                  {chart.title}
                </h3>

                <p
                  style={{
                    color: '#666',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    wordBreak: 'keep-all',
                  }}
                >
                  {chart.description}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '0.5rem',
                    }}
                  >
                    주요 기능:
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    {chart.features.map((feature, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#667eea',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    color: '#667eea',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                  }}
                >
                  예제 보기 →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            opacity: 0.8,
            fontSize: '0.9rem',
          }}
        >
          <p>Built with Next.js + React + ECharts + TypeScript</p>
        </div>
      </div>
    </div>
  );
}
