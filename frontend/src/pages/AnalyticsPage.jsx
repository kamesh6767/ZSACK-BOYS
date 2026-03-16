import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Doughnut, Bar, Radar } from 'react-chartjs-2';
import {
  fraudTrendData, riskDistributionData, fraudBySchemeData,
  claimAnomalyData, regionData
} from '../data/mockData';

// Register all Chart.js components (avoids missing registration issues)
ChartJS.register(...registerables);

const commonOpts = {
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
    tooltip: { backgroundColor: 'rgba(13,21,38,0.98)', titleColor: '#e2e8f0', bodyColor: '#94a3b8', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

const radarData = {
  labels: ['Duplicate IDs', 'Shared Accounts', 'Address Fraud', 'Amount Anomaly', 'Ghost Beneficiary', 'Cross-Scheme'],
  datasets: [{
    label: 'Fraud Indicator Intensity',
    data: [65, 82, 48, 71, 55, 38],
    backgroundColor: 'rgba(0,212,255,0.08)',
    borderColor: '#00d4ff',
    pointBackgroundColor: '#00d4ff',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: '#00d4ff',
  }]
};

const ML_METRICS = [
  { model: 'Isolation Forest', precision: 94.2, recall: 91.8, f1: 93.0, color: '#00d4ff' },
  { model: 'DBSCAN Clustering', precision: 88.6, recall: 95.3, f1: 91.8, color: '#8b5cf6' },
  { model: 'Graph Analysis', precision: 76.4, recall: 84.1, f1: 80.1, color: '#00ff88' },
  { model: 'Combined Ensemble', precision: 96.4, recall: 96.1, f1: 96.2, color: '#ff0055' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Deep fraud intelligence — ML model performance and trend analysis</p>
      </div>

      {/* ML Model Performance */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-white mb-5">ML Model Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ML_METRICS.map((m, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${m.color}20` }}>
              <div className="text-white font-semibold text-sm mb-3">{m.model}</div>
              {[
                { label: 'Precision', value: m.precision },
                { label: 'Recall', value: m.recall },
                { label: 'F1 Score', value: m.f1 },
              ].map((metric, j) => (
                <div key={j} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{metric.label}</span>
                    <span style={{ color: m.color }}>{metric.value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${metric.value}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend */}
        <div className="chart-container">
          <h3 className="font-bold text-white mb-5">Annual Fraud Detection Trend</h3>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <Line data={fraudTrendData} options={{ ...commonOpts, responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="chart-container">
          <h3 className="font-bold text-white mb-5">Risk Score Distribution</h3>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <Doughnut data={riskDistributionData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { ...commonOpts.plugins, legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 16 } } },
              cutout: '60%',
            }} />
          </div>
        </div>

        {/* Claim Anomaly */}
        <div className="chart-container">
          <h3 className="font-bold text-white mb-5">Claim Amount vs Anomaly Score</h3>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <Line data={claimAnomalyData} options={{
              ...commonOpts, responsive: true, maintainAspectRatio: false,
              scales: {
                x: { ...commonOpts.scales?.x },
                y: { ...commonOpts.scales?.y, position: 'left', title: { display: true, text: 'Claim Amount (₹K)', color: '#64748b', font: { size: 9 } } },
                y1: { ...commonOpts.scales?.y, position: 'right', title: { display: true, text: 'Anomaly Score', color: '#64748b', font: { size: 9 } }, grid: { drawOnChartArea: false } },
              }
            }} />
          </div>
        </div>

        {/* Radar */}
        <div className="chart-container">
          <h3 className="font-bold text-white mb-5">Fraud Indicator Analysis</h3>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <Radar data={radarData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { ...commonOpts.plugins, legend: { display: false } },
              scales: {
                r: {
                  ticks: { color: '#64748b', backdropColor: 'transparent', font: { size: 9 } },
                  grid: { color: 'rgba(255,255,255,0.05)' },
                  pointLabels: { color: '#94a3b8', font: { size: 10 } },
                }
              }
            }} />
          </div>
        </div>

        {/* Regional Bar */}
        <div className="chart-container lg:col-span-2">
          <h3 className="font-bold text-white mb-5">Fraud Cases by Region</h3>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <Bar data={regionData} options={{
              ...commonOpts, responsive: true, maintainAspectRatio: false,
              plugins: { ...commonOpts.plugins, legend: { display: false } },
            }} />
          </div>
        </div>
      </div>

      {/* Future Modules */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-white mb-5">🔮 Upcoming Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Real-time Streaming Monitor', desc: 'Live fraud detection using Apache Kafka data streams', status: 'Q2 2025' },
            { title: 'Aadhaar Integration', desc: 'Direct UID verification via official UIDAI API', status: 'Q3 2025' },
            { title: 'Predictive Fraud Models', desc: 'Predict future fraud patterns using LSTM networks', status: 'Q3 2025' },
            { title: 'Mobile Field Officer App', desc: 'iOS/Android app for field verification teams', status: 'Q4 2025' },
            { title: 'Federated Learning', desc: 'Privacy-preserving ML across state boundaries', status: 'Q1 2026' },
            { title: 'NLP Document Analysis', desc: 'AI-powered fake document and signature detection', status: 'Q2 2026' },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="text-[#8b5cf6] font-semibold text-sm mb-1">{m.title}</div>
              <div className="text-slate-500 text-xs mb-2">{m.desc}</div>
              <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                ETA: {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
