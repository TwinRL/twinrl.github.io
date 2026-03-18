import React, { useState, useRef } from 'react';
import { Github, FileText, Cpu, Target, BarChart3, Sparkles, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => { setIsFocused(true); setOpacity(1); };
  const handleBlur = () => { setIsFocused(false); setOpacity(0); };
  const handleMouseEnter = () => { setOpacity(1); };
  const handleMouseLeave = () => { setOpacity(0); };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[2rem] border border-white/5 bg-transparent transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.08)] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

const FadeIn = ({ children, delay = 0, className = "", y = 30 }: { children: React.ReactNode, delay?: number, className?: string, y?: number, key?: string | number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

type ExperimentSeriesKey = 'hilSerl' | 'conrft' | 'twinRlNoBuffer' | 'twinRl';

type ExperimentPanel = {
  title: string;
  steps: string[];
  minutes: string[];
  values: Record<ExperimentSeriesKey, number[]>;
  background: string;
};

const experimentSeriesStyles: Record<ExperimentSeriesKey, { color: string; label: string; marker: 'circle' | 'square' | 'diamond' | 'star' }> = {
  hilSerl: { color: '#cf7dad', label: 'HIL-SERL', marker: 'circle' },
  conrft: { color: '#f2ba74', label: 'Conrft', marker: 'square' },
  twinRlNoBuffer: { color: '#ee93bf', label: 'TwinRL w/o buffer', marker: 'diamond' },
  twinRl: { color: '#9d7bff', label: 'TwinRL', marker: 'star' },
};

const experimentPanels: ExperimentPanel[][] = [
  [
    {
      title: 'Pick-and-Place (SR, %)',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k', '14k'],
      minutes: ['0', '', '10', '', '20', '30', '40', ''],
      background: 'rgba(168,85,247,0.10)',
      values: {
        hilSerl: [0, 0, 0, 0, 5, 5, 15, 15],
        conrft: [80, 10, 10, 40, 50, 80, 80, 80],
        twinRlNoBuffer: [90, 10, 20, 30, 50, 90, 90, 90],
        twinRl: [88, 10, 10, 50, 40, 80, 100, 100],
      },
    },
    {
      title: 'Insert-Hexagon-Block (SR, %)',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k'],
      minutes: ['0', '', '10', '', '20', '30', ''],
      background: 'rgba(168,85,247,0.10)',
      values: {
        hilSerl: [0, 10, 40, 100, 99, 99, 99],
        conrft: [40, 50, 70, 90, 90, 90, 90],
        twinRlNoBuffer: [90, 30, 90, 100, 100, 100, 100],
        twinRl: [90, 50, 100, 100, 100, 100, 100],
      },
    },
    {
      title: 'Insert-Triple-Column-Block (SR, %)',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k', '14k'],
      minutes: ['0', '', '10', '', '20', '30', '40', ''],
      background: 'rgba(168,85,247,0.10)',
      values: {
        hilSerl: [0, 0, 0, 20, 70, 80, 80, 80],
        conrft: [40, 10, 50, 70, 70, 70, 70, 70],
        twinRlNoBuffer: [62, 30, 30, 40, 70, 80, 80, 80],
        twinRl: [60, 30, 40, 100, 100, 100, 100, 100],
      },
    },
    {
      title: 'Erase-Whiteboard (SR, %)',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k'],
      minutes: ['0', '', '10', '20', '', '30', ''],
      background: 'rgba(168,85,247,0.10)',
      values: {
        hilSerl: [0, 20, 40, 30, 70, 100, 100],
        conrft: [60, 50, 80, 80, 98, 98, 98],
        twinRlNoBuffer: [70, 52, 90, 90, 100, 100, 100],
        twinRl: [70, 80, 80, 100, 100, 100, 100],
      },
    },
  ],
  [
    {
      title: '',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k', '14k'],
      minutes: ['0', '', '10', '', '20', '30', '40', ''],
      background: 'rgba(34,211,238,0.09)',
      values: {
        hilSerl: [20, 10, 20, 20, 40, 40, 70, 90],
        conrft: [0, 0, 0, 0, 0, 40, 40, 40],
        twinRlNoBuffer: [20, 10, 20, 20, 40, 40, 70, 90],
        twinRl: [20, 30, 80, 100, 100, 100, 100, 100],
      },
    },
    {
      title: '',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k'],
      minutes: ['0', '', '10', '', '20', '30', ''],
      background: 'rgba(34,211,238,0.09)',
      values: {
        hilSerl: [30, 30, 70, 98, 98, 98, 98],
        conrft: [0, 75, 80, 80, 70, 40, 98],
        twinRlNoBuffer: [30, 30, 70, 100, 100, 100, 100],
        twinRl: [32, 32, 100, 100, 100, 100, 100],
      },
    },
    {
      title: '',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k', '14k'],
      minutes: ['0', '', '10', '', '20', '30', '40', ''],
      background: 'rgba(34,211,238,0.09)',
      values: {
        hilSerl: [70, 30, 0, 30, 80, 90, 90, 90],
        conrft: [0, 0, 0, 0, 0, 0, 20, 60],
        twinRlNoBuffer: [70, 30, 0, 30, 80, 90, 90, 90],
        twinRl: [70, 60, 80, 80, 100, 100, 100, 100],
      },
    },
    {
      title: '',
      steps: ['0k', '2k', '4k', '6k', '8k', '10k', '12k'],
      minutes: ['0', '', '10', '20', '', '30', ''],
      background: 'rgba(34,211,238,0.09)',
      values: {
        hilSerl: [70, 60, 75, 98, 98, 98, 98],
        conrft: [0, 30, 20, 30, 50, 60, 90],
        twinRlNoBuffer: [70, 60, 75, 100, 100, 100, 100],
        twinRl: [70, 75, 100, 100, 100, 100, 100],
      },
    },
  ],
];

const chartLegendOrder: ExperimentSeriesKey[] = ['hilSerl', 'twinRlNoBuffer', 'conrft', 'twinRl'];
const yTicks = [0, 20, 40, 60, 80, 100];
const minuteTicks = [0, 10, 20, 30, 40];
const maxStepK = 14;
const maxMinute = 45;

const getStepValue = (stepLabel: string) => {
  const stepValue = Number.parseInt(stepLabel.replace('k', ''), 10);
  return Number.isNaN(stepValue) ? 0 : stepValue;
};

const getStarPoints = (size: number) => {
  const points: string[] = [];

  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 === 0 ? size : size * 0.45;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    points.push(`${Math.cos(angle) * radius},${Math.sin(angle) * radius}`);
  }

  return points.join(' ');
};

const ExperimentMarker = ({
  marker,
  color,
  x,
  y,
}: {
  marker: 'circle' | 'square' | 'diamond' | 'star';
  color: string;
  x: number;
  y: number;
}) => {
  if (marker === 'circle') {
    return <circle cx={x} cy={y} r={4.5} fill={color} stroke="#ffffff" strokeWidth={1.5} />;
  }

  if (marker === 'square') {
    return <rect x={x - 4.5} y={y - 4.5} width={9} height={9} fill={color} stroke="#ffffff" strokeWidth={1.5} />;
  }

  if (marker === 'diamond') {
    return <polygon points={`${x},${y - 5.5} ${x + 5.5},${y} ${x},${y + 5.5} ${x - 5.5},${y}`} fill={color} stroke="#ffffff" strokeWidth={1.5} />;
  }

  return <polygon points={getStarPoints(8)} transform={`translate(${x}, ${y})`} fill={color} stroke="#ffffff" strokeWidth={1.2} />;
};

const RealWorldExperimentsChart = () => {
  const [activeSeries, setActiveSeries] = useState<ExperimentSeriesKey | null>(null);
  const [hoveredSeries, setHoveredSeries] = useState<ExperimentSeriesKey | null>(null);
  const chartWidth = 1160;
  const chartHeight = 580;
  const marginLeft = 68;
  const panelGapX = 28;
  const panelGapY = 42;
  const panelWidth = 248;
  const panelHeight = 215;
  const topOffset = 48;
  const rowTopY = topOffset;
  const rowBottomY = rowTopY + panelHeight + panelGapY;

  const getX = (panelIndex: number) => marginLeft + panelIndex * (panelWidth + panelGapX);
  const getY = (rowIndex: number) => (rowIndex === 0 ? rowTopY : rowBottomY);

  const getStepX = (stepLabel: string, plotX: number) => plotX + (getStepValue(stepLabel) / maxStepK) * panelWidth;
  const getMinuteX = (minute: number, plotX: number) => plotX + (minute / maxMinute) * panelWidth;

  const getPointCoordinates = (steps: string[], values: number[], plotX: number, plotY: number) =>
    values.map((value, index) => {
      const x = getStepX(steps[index], plotX);
      const y = plotY + panelHeight - (value / 100) * panelHeight;
      return { x, y };
    });
  const focusedSeries = activeSeries ?? hoveredSeries;

  return (
    <SpotlightCard className="p-5 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-300/80">
            Real-world Experiments
          </p>
          <p className="mt-3 text-lg md:text-[1.35rem] font-medium leading-8 tracking-tight text-[#d4d4d8]">
            <span className="font-semibold text-white">Real-world Experiments.</span>{' '}
            We report <span className="text-white">success-rate curves</span> for online RL across four manipulation tasks under both{' '}
            <span className="text-purple-300">ID</span> and <span className="text-cyan-300">OOD</span> settings.
          </p>
        </div>
        <div className="self-start w-full max-w-[24.5rem] rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-3 py-3 shadow-[0_0_30px_-18px_rgba(168,85,247,0.7)]">
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-2">
            {chartLegendOrder.map((seriesKey) => {
              const seriesStyle = experimentSeriesStyles[seriesKey];
              const isFocused = focusedSeries === seriesKey;
              const isDimmed = focusedSeries !== null && focusedSeries !== seriesKey;

              return (
                <button
                  key={seriesKey}
                  type="button"
                  onMouseEnter={() => setHoveredSeries(seriesKey)}
                  onMouseLeave={() => setHoveredSeries((current) => (current === seriesKey ? null : current))}
                  onFocus={() => setHoveredSeries(seriesKey)}
                  onBlur={() => setHoveredSeries((current) => (current === seriesKey ? null : current))}
                  onClick={() => setActiveSeries((current) => (current === seriesKey ? null : seriesKey))}
                  aria-pressed={activeSeries === seriesKey}
                  className={`flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-sm font-medium transition-all duration-200 ${
                    isFocused
                      ? 'border-white/20 bg-white/[0.07] text-white shadow-[0_0_18px_-10px_rgba(168,85,247,0.85)]'
                      : isDimmed
                        ? 'border-transparent bg-transparent text-[#71717a] opacity-70 hover:text-[#d4d4d8]'
                        : 'border-transparent bg-transparent text-[#e4e4e7] hover:bg-white/[0.04]'
                  }`}
                >
                  <svg width="44" height="14" viewBox="0 0 44 14" className="shrink-0 overflow-visible">
                    <line x1="2" y1="7" x2="42" y2="7" stroke={seriesStyle.color} strokeWidth="2.5" strokeLinecap="round" />
                    <ExperimentMarker marker={seriesStyle.marker} color={seriesStyle.color} x={22} y={7} />
                  </svg>
                  <span className="whitespace-nowrap leading-5">{seriesStyle.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-3 md:p-4">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="block w-full h-auto" role="img" aria-label="Real-world experiment success-rate curves across in-distribution and out-of-distribution settings">
          <rect x={0} y={0} width={chartWidth} height={chartHeight} rx={28} fill="#09090b" />

          {experimentPanels.map((row, rowIndex) =>
            row.map((panel, panelIndex) => {
              const plotX = getX(panelIndex);
              const plotY = getY(rowIndex);

              return (
                <g key={`${rowIndex}-${panelIndex}`}>
                  <rect
                    x={plotX}
                    y={plotY}
                    width={panelWidth}
                    height={panelHeight}
                    rx={18}
                    fill={panel.background}
                    stroke={rowIndex === 0 ? 'rgba(236,72,153,0.18)' : 'rgba(34,211,238,0.18)'}
                    strokeWidth={1.5}
                  />

                  {yTicks.map((tick) => {
                    const lineY = plotY + panelHeight - (tick / 100) * panelHeight;

                    return (
                      <g key={tick}>
                        <line x1={plotX} y1={lineY} x2={plotX + panelWidth} y2={lineY} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4 4" />
                        {panelIndex === 0 && (
                          <text x={plotX - 10} y={lineY + 5} fill="#a1a1aa" fontSize={13} textAnchor="end">
                            {tick}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {panel.steps.map((step, stepIndex) => {
                    const x = getStepX(step, plotX);

                    return (
                      <g key={`${step}-${stepIndex}`}>
                        <line x1={x} y1={plotY} x2={x} y2={plotY + panelHeight} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 4" />
                        {rowIndex === 1 && (
                          <>
                            <text x={x} y={plotY + panelHeight + 18} fill="#e4e4e7" fontSize={13} textAnchor="middle">
                              {step}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}

                  {rowIndex === 1 &&
                    minuteTicks.map((minute, minuteIndex) => {
                      const x = getMinuteX(minute, plotX);

                      return (
                        <text key={`minute-${minute}`} x={x} y={plotY + panelHeight + 34} fill="#71717a" fontSize={11} textAnchor="middle">
                          {minute}
                        </text>
                      );
                    })}

                  {rowIndex === 0 && panel.title && (
                    <text x={plotX + panelWidth / 2} y={plotY - 12} fill="#f5f5f5" fontSize={13} fontWeight={600} textAnchor="middle">
                      {panel.title}
                    </text>
                  )}

                  {chartLegendOrder.map((seriesKey) => {
                    const seriesStyle = experimentSeriesStyles[seriesKey];
                    const points = getPointCoordinates(panel.steps, panel.values[seriesKey], plotX, plotY);
                    const isFocused = focusedSeries === null || focusedSeries === seriesKey;

                    return (
                      <g key={seriesKey} opacity={isFocused ? 1 : 0.18}>
                        <polyline
                          fill="none"
                          stroke={seriesStyle.color}
                          strokeWidth={isFocused ? 3.2 : 2.2}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          points={points.map((point) => `${point.x},${point.y}`).join(' ')}
                        />
                        {points.map((point, pointIndex) => (
                          <g key={`${seriesKey}-${pointIndex}`}>
                            <circle cx={point.x} cy={point.y} r={11} fill="transparent" />
                            <ExperimentMarker
                              marker={seriesStyle.marker}
                              color={seriesStyle.color}
                              x={point.x}
                              y={point.y}
                            />
                          </g>
                        ))}
                      </g>
                    );
                  })}
                </g>
              );
            }),
          )}

          <text
            x={18}
            y={rowTopY + panelHeight / 2}
            fill="#e9d5ff"
            fontSize={17}
            fontWeight={700}
            textAnchor="middle"
            transform={`rotate(-90, 18, ${rowTopY + panelHeight / 2})`}
          >
            In-Distribution
          </text>
          <text
            x={18}
            y={rowBottomY + panelHeight / 2}
            fill="#a5f3fc"
            fontSize={17}
            fontWeight={700}
            textAnchor="middle"
            transform={`rotate(-90, 18, ${rowBottomY + panelHeight / 2})`}
          >
            Out-of-Distribution
          </text>

          {experimentPanels[1].map((_, panelIndex) => {
            const plotX = getX(panelIndex);
            const axisY = rowBottomY + panelHeight + 24;

            return (
              <g key={`axis-${panelIndex}`}>
                <line x1={plotX} y1={axisY} x2={plotX + panelWidth} y2={axisY} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
                <polygon
                  points={`${plotX + panelWidth},${axisY} ${plotX + panelWidth - 8},${axisY - 5} ${plotX + panelWidth - 8},${axisY + 5}`}
                  fill="rgba(255,255,255,0.35)"
                />
                <text x={plotX + panelWidth - 2} y={axisY + 18} fill="#a1a1aa" fontSize={11} textAnchor="end">
                  min
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </SpotlightCard>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('pick-place');
  const [activeRobustnessTab, setActiveRobustnessTab] = useState('pick-place');
  const teaserVideoSrc = `${import.meta.env.BASE_URL}videos/teaser.mp4`;
  const motivationImageSrc = `${import.meta.env.BASE_URL}images/motivation.png`;
  const pipelineImageSrc = `${import.meta.env.BASE_URL}images/pipline.png`;
  const trainingVideoBase = `${import.meta.env.BASE_URL}videos/online_rl_training`;
  const evaluationVideoBase = `${import.meta.env.BASE_URL}videos/final_evaluation`;
  const robustnessVideoBase = `${import.meta.env.BASE_URL}videos/robustness`;
  const sectionBackgrounds = {
    glow: 'relative z-20',
    dark: 'relative z-20 bg-black',
  };
  const authors = [
    { name: 'Qinwen Xu', href: 'https://github.com/zhourui9813/Twin-RL', tags: '1,*' },
    { name: 'Jiaming Liu', href: 'https://liujiaming1996.github.io/', tags: '1,*,†' },
    { name: 'Rui Zhou', href: 'https://zhourui9813.github.io/', tags: '4,*' },
    { name: 'Shaojun Shi', href: 'https://github.com/Daniel-Shii', tags: '1,*' },
    { name: 'Nuowei Han', href: 'https://github.com/HNW-HAN', tags: '1,*' },
    { name: 'Zhuoyang Liu', href: 'https://zhuoyang-liu.github.io/', tags: '1' },
    { name: 'Chenyang Gu', href: 'http://guchenyang.site/', tags: '1' },
    { name: 'Shuo Gu', href: 'https://openreview.net/profile?id=%7EShuo_Gu3', tags: '2' },
    { name: 'Yang Yue', href: 'https://scholar.google.com/citations?hl=zh-TW&user=tE1oVQ4AAAAJ', tags: '3' },
    { name: 'Gao Huang', href: 'https://gaohuang-net.github.io/', tags: '3' },
    { name: 'Wenzhao Zheng', href: 'https://wzzheng.net/', tags: '3' },
    { name: 'Sirui Han', href: 'https://siruihan.com/', tags: '4' },
    { name: 'Peng Jia', href: 'https://scholar.google.com/citations?user=Z_QY_VwAAAAJ&hl=en', tags: '2' },
    { name: 'Shanghang Zhang', href: 'https://www.shanghangzhang.com/', tags: '1,✉' },
  ];
  const affiliations = [
    { id: '1', name: 'Peking University' },
    { id: '2', name: 'Simplexity Robotics' },
    { id: '3', name: 'Tsinghua University' },
    { id: '4', name: 'Hong Kong University of Science and Technology' },
  ];

  const tasks = [
    {
      id: 'pick-place',
      name: 'Pick-and-Place',
      time: '20 mins',
      videos: {
        training: {
          id: `${trainingVideoBase}/hil_indomain.mp4`,
          ood: `${trainingVideoBase}/hil_outdomain.mp4`,
        },
        evaluation: {
          id: `${evaluationVideoBase}/banana_in_test_5times.mp4`,
          ood: `${evaluationVideoBase}/banana_out_test_7times.mp4`,
        },
      },
    },
    {
      id: 'insert-hex',
      name: 'Insert-Hexagon-Block',
      time: '13 mins',
      videos: {
        training: {
          id: `${trainingVideoBase}/in_block_ex3_w_buffer_1.mp4`,
          ood: `${trainingVideoBase}/out_block_ex3_w_buffer_1.mp4`,
        },
        evaluation: {
          id: `${evaluationVideoBase}/block_in_test_13times.mp4`,
          ood: `${evaluationVideoBase}/block_out_test_10times.mp4`,
        },
      },
    },
    {
      id: 'insert-triple',
      name: 'Insert-Triple-Column-Block',
      time: '25 mins',
      videos: {
        training: {
          id: `${trainingVideoBase}/in_circle_ex3_w_buffer_1.mp4`,
          ood: `${trainingVideoBase}/out_circle_ex3_wo_buffer_1.mp4`,
        },
        evaluation: {
          id: `${evaluationVideoBase}/circle_in_test_5times_1.mp4`,
          ood: `${evaluationVideoBase}/circle_out_test_11times.mp4`,
        },
      },
    },
    {
      id: 'erase',
      name: 'Erase-Whiteboard',
      time: '15 mins',
      videos: {
        training: {
          id: `${trainingVideoBase}/in_erase_ex3.mp4`,
          ood: `${trainingVideoBase}/out_erase_ex3_w_buffer.mp4`,
        },
        evaluation: {
          id: `${evaluationVideoBase}/erase_in_12times.mp4`,
          ood: `${evaluationVideoBase}/erase_out_11times.mp4`,
        },
      },
    },
  ];
  const robustnessTasks = [
    {
      id: 'pick-place',
      name: 'Pick-and-Place',
      videos: [
        { title: 'Complex Background', src: `${robustnessVideoBase}/banana_background_test_1.mp4`, accent: 'purple' },
        { title: 'Dark Lighting', src: `${robustnessVideoBase}/banana_dark_test_2.mp4`, accent: 'pink' },
        { title: 'Dynamic Lighting', src: `${robustnessVideoBase}/banana_dynamic_test.mp4`, accent: 'orange' },
      ],
    },
    {
      id: 'insert-hex',
      name: 'Insert-Hexagon-Block',
      videos: [
        { title: 'Complex Background', src: `${robustnessVideoBase}/block_background_test.mp4`, accent: 'purple' },
        { title: 'Dark Lighting', src: `${robustnessVideoBase}/block_dark_test.mp4`, accent: 'pink' },
        { title: 'Dynamic Lighting', src: `${robustnessVideoBase}/block_dynamic_test.mp4`, accent: 'orange' },
      ],
    },
    {
      id: 'erase',
      name: 'Erase-Whiteboard',
      videos: [
        { title: 'Generalization', src: `${robustnessVideoBase}/erase_whiteboard_generalize.mp4`, accent: 'purple' },
      ],
    },
  ];
  const activeTask = tasks.find((task) => task.id === activeTab) ?? tasks[0];
  const activeRobustnessTask = robustnessTasks.find((task) => task.id === activeRobustnessTab) ?? robustnessTasks[0];

  return (
    <div className="min-h-screen bg-[#030303] text-[#a1a1aa] selection:bg-purple-500/30 overflow-x-hidden font-sans">
      {/* Animated Background Grid & Huly-style Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-white bg-grid-pattern opacity-30" />
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-90">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/30 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/30 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-pink-600/20 blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/20 blur-[100px] animate-blob animation-delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#030303]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 font-bold text-xl tracking-tight text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              TwinRL-VLA
            </div>
            <div className="hidden md:flex space-x-8">
              {['Abstract', 'Motivation', 'Method', 'Evaluation', 'Robustness'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center w-full"
        >
          {/* Removed the extra line above the title as requested */}
          
          <h1 className="overflow-visible text-5xl sm:text-7xl md:text-[8.25rem] lg:text-[10.1rem] font-black tracking-tighter text-white mb-6 pt-2 pb-3 leading-[0.92] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            <span className="relative inline-flex items-end overflow-visible">
              <span className="absolute inset-x-2 bottom-4 h-8 bg-gradient-to-r from-purple-500/0 via-fuchsia-500/40 to-orange-500/0 blur-2xl"></span>
              <span className="relative inline-flex -space-x-[0.05em]">
                {[
                  { letter: 'T', className: 'translate-y-[0.02em] -rotate-[1.5deg]', gradient: 'bg-[linear-gradient(180deg,#ffffff_0%,#f7e8ff_42%,#d8b4fe_70%,#fb7185_100%)]' },
                  { letter: 'w', className: '-translate-y-[0.02em] rotate-[1deg]', gradient: 'bg-[linear-gradient(180deg,#ffffff_0%,#f7e8ff_42%,#d8b4fe_70%,#fb7185_100%)]' },
                  { letter: 'i', className: 'translate-y-[0.01em] -rotate-[1deg]', gradient: 'bg-[linear-gradient(180deg,#ffffff_0%,#f7e8ff_42%,#d8b4fe_70%,#fb7185_100%)]' },
                  { letter: 'n', className: '-translate-y-[0.01em] rotate-[1.5deg]', gradient: 'bg-[linear-gradient(180deg,#ffffff_0%,#f7e8ff_42%,#d8b4fe_70%,#fb7185_100%)]' },
                  { letter: 'R', className: 'translate-y-[0.03em] -rotate-[2deg]', gradient: 'bg-[linear-gradient(180deg,#ffffff_0%,#f7e8ff_42%,#d8b4fe_70%,#fb7185_100%)]' },
                  { letter: 'L', className: '-translate-y-[0.01em] rotate-[1deg]', gradient: 'bg-[linear-gradient(180deg,#ffffff_0%,#f7e8ff_42%,#d8b4fe_70%,#fb7185_100%)]' },
                  { letter: '-', className: 'translate-y-[0.06em] -rotate-[1deg] px-[0.02em]', gradient: 'bg-[linear-gradient(180deg,#c084fc_0%,#a855f7_100%)]' },
                  { letter: 'V', className: '-translate-y-[0.01em] rotate-[1.5deg]', gradient: 'bg-[linear-gradient(180deg,#c084fc_0%,#ec4899_55%,#fb7185_100%)]' },
                  { letter: 'L', className: 'translate-y-[0.02em] -rotate-[1.5deg]', gradient: 'bg-[linear-gradient(180deg,#f472b6_0%,#ec4899_55%,#fb7185_100%)]' },
                  { letter: 'A', className: '-translate-y-[0.01em] rotate-[1deg]', gradient: 'bg-[linear-gradient(180deg,#fb7185_0%,#fb7185_35%,#fb923c_100%)]' },
                ].map(({ letter, className, gradient }, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className={`relative inline-block ${className} text-transparent bg-clip-text ${gradient} [text-shadow:0_0_28px_rgba(244,114,182,0.16)]`}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </span>
          </h1>
          
          <h2 className="relative overflow-visible text-[1.55rem] md:text-[2.45rem] font-semibold text-[#f4f4f5] mb-10 pt-1 pb-2 leading-[1.16] max-w-5xl mx-auto tracking-[-0.03em] drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]">
            <span className="absolute inset-x-20 top-1/2 h-10 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl"></span>
            <span className="relative inline-block">
              <span className="inline-block -rotate-[0.35deg] bg-[linear-gradient(180deg,#ffffff_0%,#f4f4f5_62%,#e4e4e7_100%)] bg-clip-text text-transparent">
                Digital Twin-Driven Reinforcement Learning
              </span>
              <br className="hidden md:block" />
              <span className="inline-block translate-y-[0.03em] rotate-[0.2deg] bg-[linear-gradient(180deg,#f8fafc_0%,#e4e4e7_68%,#c4b5fd_100%)] bg-clip-text text-transparent">
                for Real-World Robotic Manipulation
              </span>
            </span>
          </h2>
          
          <div aria-hidden="true" className="hidden">
            <p className="mb-2 text-[#a1a1aa]">
              Qinwen Xu¹*, Jiaming Liu¹*†, Rui Zhou⁴*, Shaojun Shi¹*, Nuowei Han¹*, Zhuoyang Liu¹, Chenyang Gu¹, Shuo Gu², Yang Yue³, Gao Huang³, Wenzhao Zheng³, Sirui Han⁴, Peng Jia², Shanghang Zhang¹✉
            </p>
            <p className="text-xs">
              ¹Peking University, ²Simplexity Robotics, ³Tsinghua University, ⁴Hong Kong University of Science and Technology
            </p>
          </div>

          <div className="mb-12 max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 text-base md:text-[1.08rem] leading-7 text-[#d4d4d8]">
              {authors.map((author) => (
                <a
                  key={author.name}
                  href={author.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group transition-colors hover:text-white"
                >
                  <span className="border-b border-transparent group-hover:border-purple-400/60 transition-colors">
                    {author.name}
                  </span>
                  <sup className="ml-1 text-[0.68em] text-purple-300 font-medium">{author.tags}</sup>
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm md:text-base text-[#a1a1aa]">
              {affiliations.map((affiliation) => (
                <span key={affiliation.id}>
                  <sup className="mr-1 text-purple-300 font-semibold">{affiliation.id}</sup>
                  {affiliation.name}
                </span>
              ))}
            </div>

            <p className="mt-4 text-xs md:text-sm text-[#71717a] tracking-wide">
              * Equal Contribution&nbsp;&nbsp;&nbsp;† Project Lead&nbsp;&nbsp;&nbsp;✉ Corresponding Author
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            <a href="https://arxiv.org/abs/2602.09023" target="_blank" rel="noreferrer" className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none group shadow-[0_0_60px_-10px_rgba(168,85,247,0.8)] hover:shadow-[0_0_80px_-5px_rgba(236,72,153,0.9)] transition-shadow duration-500">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#ec4899_50%,#a855f7_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#030303] px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors group-hover:bg-[#0a0a0a]">
                <FileText className="w-5 h-5 mr-2" />
                Read Paper
              </span>
            </a>
            <a href="https://github.com/zhourui9813/TwinRL" target="_blank" rel="noreferrer" className="inline-flex h-14 items-center px-8 rounded-full bg-white/5 text-white border border-white/10 font-medium hover:bg-white/10 transition-all backdrop-blur-sm hover:border-white/20">
              <Github className="w-5 h-5 mr-2" />
              View Code
            </a>
          </div>

          {/* Hero Video Teaser - Huly Style Floating */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative max-w-6xl mx-auto rounded-[2rem] overflow-hidden shadow-[0_0_80px_-20px_rgba(168,85,247,0.2)] border border-white/10 bg-transparent aspect-video group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-90 z-10 pointer-events-none"></div>
            <video
              src={teaserVideoSrc}
              className="w-full h-full object-cover opacity-70 mix-blend-screen"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Abstract */}
      <section aria-hidden="true" className="hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Abstract</h2>
            <div className="text-xl md:text-2xl leading-relaxed md:leading-relaxed font-medium text-[#71717a] text-center tracking-tight">
              <span className="text-white">Despite strong generalization capabilities,</span> Vision–Language–Action (VLA) models remain constrained by the high cost of expert demonstrations and insufficient real-world interaction. <br/><br/>
              <span className="text-[#52525b]">Through systematic real-world experiments, we observe that the effective exploration space of online RL is closely tied to the data distribution of supervised fine-tuning (SFT).</span> <br/><br/>
              We propose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">TwinRL</span>, a digital twin–real-world collaborative RL framework designed to scale and guide exploration for VLA models, delivering at least a <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">30% speedup</span> over prior methods.
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Abstract */}
      <section id="abstract" className={`py-32 ${sectionBackgrounds.glow}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Abstract
              </h2>
              <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto md:mx-0">
                A digital twin-real-world collaborative reinforcement learning framework for efficient VLA manipulation.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SpotlightCard className="p-8 md:p-12">
              <div className="max-w-5xl text-lg md:text-xl leading-8 md:leading-9 text-[#a1a1aa] tracking-tight space-y-6">
                <p>
                 We propose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 font-bold drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">TwinRL</span>, a <span className="text-white font-medium">digital twin-real-world collaborative RL framework</span> designed to scale and guide exploration for VLA models. First, a high-fidelity <span className="text-white font-medium">digital twin</span> is efficiently reconstructed from smartphone-captured scenes, enabling realistic bidirectional transfer between real and simulated environments. During the SFT warm-up stage, we introduce an <span className="text-purple-300 font-medium">exploration space expansion</span> strategy using digital twins to broaden the support of the data trajectory distribution.
                </p>
                <p>
                  Building on this enhanced initialization, we propose a <span className="text-pink-300 font-medium">sim-to-real guided exploration</span> strategy to further accelerate online RL. Specifically, TwinRL performs efficient and parallel online RL in the digital twin prior to deployment, effectively bridging the gap between offline and online training stages. Subsequently, we exploit efficient digital twin sampling to identify failure-prone yet informative configurations, which are used to guide targeted human-in-the-loop rollouts on the real robot.
                </p>
                <p>
                  In our experiments, TwinRL approaches <span className="text-white font-semibold">100% success</span> in both in-distribution regions covered by real-world demonstrations and out-of-distribution regions, delivering at least a <span className="text-orange-300 font-semibold">30% speedup</span> over prior real-world RL methods and requiring only about <span className="text-purple-300 font-semibold">20 minutes</span> on average across four tasks.
                </p>
              </div>
            </SpotlightCard>
          </FadeIn>
        </div>
      </section>

      {/* Motivation Section */}
      <section id="motivation" className={`py-32 ${sectionBackgrounds.dark} border-y border-white/5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Motivation</h2>
              <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto md:mx-0">
                Why do we need a digital twin-driven approach for Vision-Language-Action models?
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motivation Figure */}
            <FadeIn delay={0.1} className="md:col-span-2 mb-4">
              <SpotlightCard className="p-4 md:p-5">
                <img
                  src={motivationImageSrc}
                  alt="Motivation Figure"
                  className="block w-full h-auto rounded-[1.5rem] object-contain"
                />
              </SpotlightCard>
            </FadeIn>

            <FadeIn delay={0.2}>
              <SpotlightCard className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                  <Target className="w-6 h-6 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">The SFT Bottleneck</h3>
                <p className="text-[#a1a1aa] leading-relaxed mt-auto">
                  Supervised Fine-Tuning (SFT) for VLA models relies heavily on expensive, human-collected expert demonstrations. This severely limits the diversity of the training data and constrains the model's ability to generalize to novel, out-of-distribution scenarios.
                </p>
              </SpotlightCard>
            </FadeIn>

            <FadeIn delay={0.3}>
              <SpotlightCard className="p-8 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                  <BarChart3 className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Exploration Collapse in RL</h3>
                <p className="text-[#a1a1aa] leading-relaxed mt-auto">
                  When applying online RL directly in the real world, we observed that the policy's effective exploration space collapses around the initial SFT data distribution. It struggles to discover successful trajectories for complex object configurations without guidance.
                </p>
              </SpotlightCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Methodology - Bento Grid */}
      <section id="method" className={`py-32 ${sectionBackgrounds.glow}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">Methodology</h2>
              <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto md:mx-0">
                A collaborative framework bridging digital twins and real-world robots.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Architecture Diagram */}
            <FadeIn delay={0.1} className="md:col-span-3">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center tracking-tight">
                  <Layers className="w-8 h-8 mr-3 text-purple-400" />
                  System Architecture
                </h3>
                <p className="text-[#a1a1aa] max-w-2xl text-lg">
                  TwinRL leverages digital twins as exploration amplifiers and guides during both SFT and online RL stages.
                </p>
              </div>
              <SpotlightCard className="p-4 md:p-5">
                <img
                  src={pipelineImageSrc}
                  alt="System Architecture"
                  className="block w-full h-auto rounded-[1.5rem] object-contain"
                />
              </SpotlightCard>
            </FadeIn>

            {/* Step 1 */}
            <FadeIn delay={0.2}>
              <SpotlightCard className="p-8 h-full flex flex-col">
                <div className="absolute -right-4 -top-10 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none">1</div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <Sparkles className="w-6 h-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Exploration Space Expansion</h3>
                <p className="text-[#a1a1aa] leading-relaxed mt-auto">
                  Starting from human teleoperation, we synthesize diverse digital-twin demonstrations to broaden SFT coverage and provide a stronger deployment prior.
                </p>
              </SpotlightCard>
            </FadeIn>

            {/* Step 2 */}
            <FadeIn delay={0.3}>
              <SpotlightCard className="p-8 h-full flex flex-col">
                <div className="absolute -right-4 -top-10 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none">2</div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(236,72,153,0.4)]">
                  <Cpu className="w-6 h-6 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Twin Online RL</h3>
                <p className="text-[#a1a1aa] leading-relaxed mt-auto">
                  The SFT-initialized policy is trained with scalable, parallel online RL in the digital twin to harvest RL-style rollouts, bridging the offline-to-online gap.
                </p>
              </SpotlightCard>
            </FadeIn>

            {/* Step 3 */}
            <FadeIn delay={0.4}>
              <SpotlightCard className="p-8 h-full flex flex-col">
                <div className="absolute -right-4 -top-10 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none">3</div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                  <Zap className="w-6 h-6 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Real World Online RL</h3>
                <p className="text-[#a1a1aa] leading-relaxed mt-auto">
                  The digital twin efficiently identifies failure-prone yet informative object configurations to guide targeted Human-in-the-Loop (HiL) rollouts on the real robot.
                </p>
              </SpotlightCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats / Evaluation */}
      <section id="evaluation" className={`py-32 ${sectionBackgrounds.dark} border-y border-white/5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
              <div className="py-6">
                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#71717a] tracking-tighter mb-2">100<span className="text-purple-400">%</span></div>
                <div className="text-lg text-[#71717a] font-medium tracking-wide uppercase text-sm">Success Rate</div>
              </div>
              <div className="py-6">
                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#71717a] tracking-tighter mb-2">20<span className="text-pink-400 text-4xl">min</span></div>
                <div className="text-lg text-[#71717a] font-medium tracking-wide uppercase text-sm">Average Convergence Time</div>
              </div>
              <div className="py-6">
                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#71717a] tracking-tighter mb-2">30<span className="text-orange-400 text-4xl">%</span></div>
                <div className="text-lg text-[#71717a] font-medium tracking-wide uppercase text-sm">Speedup over Baselines</div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mb-16">
            <RealWorldExperimentsChart />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-[#0a0a0a] rounded-full w-fit mx-auto border border-white/5 shadow-inner">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setActiveTab(task.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === task.id ? 'text-white' : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  {activeTab === task.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#18181b] rounded-full border border-white/10 shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    {task.name}
                  </span>
                </button>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <SpotlightCard className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-8"
                >
                  {[
                    {
                      key: 'training',
                      title: 'Real World Online RL Training',
                      videos: activeTask.videos.training,
                    },
                    {
                      key: 'evaluation',
                      title: 'Final Evaluation',
                      videos: activeTask.videos.evaluation,
                    },
                  ].map((section) => (
                    <div key={section.key} className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm md:text-base font-semibold text-white tracking-tight">
                          {section.title}
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-[0.15em] flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-400 mr-3 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                            In-Distribution
                          </h4>
                          <div className="aspect-video bg-[#030303] rounded-2xl border border-purple-500/20 overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] transition-shadow duration-500">
                            <video
                              key={`${activeTask.id}-${section.key}-id`}
                              src={section.videos.id}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-[0.15em] flex items-center">
                            <div className="w-2 h-2 rounded-full bg-pink-400 mr-3 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                            Out-of-Distribution
                          </h4>
                          <div className="aspect-video bg-[#030303] rounded-2xl border border-pink-500/20 overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:shadow-[0_0_50px_rgba(236,72,153,0.3)] transition-shadow duration-500">
                            <video
                              key={`${activeTask.id}-${section.key}-ood`}
                              src={section.videos.ood}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </SpotlightCard>
          </FadeIn>
        </div>
      </section>

      {/* Robustness Study */}
      <section id="robustness" className={`py-32 ${sectionBackgrounds.glow}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">Robustness</h2>
              <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto md:mx-0">
                Evaluating policy resilience under severe environmental perturbations.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-[#0a0a0a] rounded-full w-fit mx-auto border border-white/5 shadow-inner">
              {robustnessTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setActiveRobustnessTab(task.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeRobustnessTab === task.id ? 'text-white' : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  {activeRobustnessTab === task.id && (
                    <motion.div
                      layoutId="activeRobustnessTab"
                      className="absolute inset-0 bg-[#18181b] rounded-full border border-white/10 shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    {task.name}
                  </span>
                </button>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <SpotlightCard className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRobustnessTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  {activeRobustnessTask.videos.length === 1 && <div className="hidden md:block" />}
                  {activeRobustnessTask.videos.map((video) => {
                    const accentStyles =
                      video.accent === 'pink'
                        ? {
                            dot: 'bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]',
                            border: 'border-pink-500/20',
                            shadow: 'shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:shadow-[0_0_50px_rgba(236,72,153,0.3)]',
                          }
                        : video.accent === 'orange'
                          ? {
                              dot: 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]',
                              border: 'border-orange-500/20',
                              shadow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]',
                            }
                          : {
                              dot: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
                              border: 'border-purple-500/20',
                              shadow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]',
                            };

                    return (
                      <div
                        key={video.src}
                        className={`space-y-3 ${activeRobustnessTask.videos.length === 1 ? 'md:col-start-2' : ''}`}
                      >
                        <h4 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-[0.15em] flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${accentStyles.dot}`}></div>
                          {video.title}
                        </h4>
                        <div className={`aspect-video bg-[#030303] rounded-2xl border overflow-hidden transition-shadow duration-500 ${accentStyles.border} ${accentStyles.shadow}`}>
                          <video
                            key={`${activeRobustnessTask.id}-${video.src}`}
                            src={video.src}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {activeRobustnessTask.videos.length === 1 && <div className="hidden md:block" />}
                </motion.div>
              </AnimatePresence>
            </SpotlightCard>
          </FadeIn>
        </div>
      </section>

      {/* Citation */}
      <section className="py-20 relative z-20 bg-black border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Citation
              </h2>
              <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto md:mx-0">
                If you find TwinRL-VLA useful, please cite our paper.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <SpotlightCard className="p-6 md:p-8">
              <pre className="overflow-x-auto rounded-[1.5rem] border border-white/8 bg-[#050505]/80 px-5 py-5 text-left text-sm md:text-[0.95rem] leading-7 text-[#d4d4d8]">
                <code>{`@article{xu2026twinrl,
  title={TwinRL-VLA: Digital Twin-Driven Reinforcement Learning for Real-World Robotic Manipulation},
  author={Xu, Qinwen and Liu, Jiaming and Zhou, Rui and Shi, Shaojun and Han, Nuowei and Liu, Zhuoyang and Gu, Chenyang and Gu, Shuo and Yue, Yang and Huang, Gao and others},
  journal={arXiv preprint arXiv:2602.09023},
  year={2026}
}`}</code>
              </pre>
            </SpotlightCard>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-20 relative overflow-hidden z-20">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">TwinRL-VLA</h2>
          </div>
          <p className="mb-8 text-[#71717a] max-w-md mx-auto">
            Digital Twin-Driven Reinforcement Learning for Real-World Robotic Manipulation
          </p>
          <div className="flex justify-center space-x-6 mb-12">
            <a href="https://github.com/zhourui9813/TwinRL" target="_blank" rel="noreferrer" className="text-[#52525b] hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="w-6 h-6" />
            </a>
          </div>
          <p className="text-sm text-[#52525b] font-medium">
            © {new Date().getFullYear()} TwinRL-VLA Authors. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
