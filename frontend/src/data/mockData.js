// Mock data for CyberShield demo

export const mockBeneficiaries = [
  { id: 'BNF-001', name: 'Ramesh Kumar', address: '45 MG Road, Delhi', phone: '9876543210', bankAcc: 'SBI-***4521', nationalId: 'UID-7821-4532', scheme: 'PM-KISAN', claimAmount: 6000, riskScore: 87, fraudType: 'Duplicate Identity', status: 'Confirmed Fraud', region: 'Delhi', date: '2024-01-15' },
  { id: 'BNF-002', name: 'Suresh Patel', address: '12 Ring Road, Mumbai', phone: '9123456780', bankAcc: 'HDFC-***8832', nationalId: 'UID-3210-7654', scheme: 'NREGA', claimAmount: 12000, riskScore: 72, fraudType: 'Ghost Beneficiary', status: 'Under Investigation', region: 'Maharashtra', date: '2024-01-18' },
  { id: 'BNF-003', name: 'Priya Singh', address: '78 Anna Nagar, Chennai', phone: '8765432190', bankAcc: 'SBI-***4521', nationalId: 'UID-5542-1234', scheme: 'PM-AWY', claimAmount: 250000, riskScore: 94, fraudType: 'Shared Bank Account', status: 'Confirmed Fraud', region: 'Tamil Nadu', date: '2024-01-20' },
  { id: 'BNF-004', name: 'Arjun Mehta', address: '33 Koramangala, Bangalore', phone: '7654321890', bankAcc: 'ICICI-***2211', nationalId: 'UID-9988-7766', scheme: 'PMJDY', claimAmount: 5000, riskScore: 45, fraudType: 'Anomalous Claim', status: 'Under Investigation', region: 'Karnataka', date: '2024-01-22' },
  { id: 'BNF-005', name: 'Kavita Sharma', address: '90 Civil Lines, Jaipur', phone: '6543218900', bankAcc: 'PNB-***6677', nationalId: 'UID-1122-3344', scheme: 'PM-KISAN', claimAmount: 6000, riskScore: 18, fraudType: 'None', status: 'Cleared', region: 'Rajasthan', date: '2024-01-25' },
  { id: 'BNF-006', name: 'Deepak Verma', address: '45 MG Road, Delhi', phone: '9876543210', bankAcc: 'BOB-***9900', nationalId: 'UID-4455-6677', scheme: 'PM-KISAN', claimAmount: 6000, riskScore: 81, fraudType: 'Shared Address + Phone', status: 'Confirmed Fraud', region: 'Delhi', date: '2024-01-28' },
  { id: 'BNF-007', name: 'Anita Gupta', address: '56 Park Street, Kolkata', phone: '9988776655', bankAcc: 'UBI-***3344', nationalId: 'UID-6677-8899', scheme: 'NREGA', claimAmount: 18000, riskScore: 63, fraudType: 'Multiple Claims', status: 'Under Investigation', region: 'West Bengal', date: '2024-02-01' },
  { id: 'BNF-008', name: 'Rajesh Yadav', address: '23 Hazratganj, Lucknow', phone: '8877665544', bankAcc: 'SBI-***7788', nationalId: 'UID-2233-4455', scheme: 'PM-AWY', claimAmount: 180000, riskScore: 29, fraudType: 'None', status: 'Cleared', region: 'Uttar Pradesh', date: '2024-02-03' },
  { id: 'BNF-009', name: 'Sunita Devi', address: '67 FC Road, Pune', phone: '7766554433', bankAcc: 'HDFC-***8832', nationalId: 'UID-8899-0011', scheme: 'NREGA', claimAmount: 24000, riskScore: 76, fraudType: 'Shared Bank Account', status: 'Confirmed Fraud', region: 'Maharashtra', date: '2024-02-05' },
  { id: 'BNF-010', name: 'Mohan Das', address: '34 Banjara Hills, Hyderabad', phone: '6655443322', bankAcc: 'SBI-***1122', nationalId: 'UID-0011-2233', scheme: 'PMJDY', claimAmount: 8500, riskScore: 55, fraudType: 'Suspicious Cluster', status: 'Under Investigation', region: 'Telangana', date: '2024-02-08' },
];

export const mockAlerts = [
  { id: 'ALT-001', type: 'critical', title: 'Duplicate Identity Cluster Detected', message: '12 beneficiaries sharing same UID prefix in Delhi', time: '2 min ago', read: false },
  { id: 'ALT-002', type: 'high', title: 'Shared Bank Account Alert', message: 'Bank account SBI-***4521 linked to 3 different beneficiaries', time: '15 min ago', read: false },
  { id: 'ALT-003', type: 'high', title: 'Anomalous Claim Amount', message: 'Claim amount 40x above scheme average in Maharashtra cluster', time: '1 hr ago', read: false },
  { id: 'ALT-004', type: 'medium', title: 'Ghost Beneficiary Suspected', message: 'BNF-002 has no biometric verification record', time: '3 hrs ago', read: true },
  { id: 'ALT-005', type: 'medium', title: 'Suspicious Cluster Found', message: 'DBSCAN detected cluster of 8 beneficiaries with overlapping attributes', time: '5 hrs ago', read: true },
  { id: 'ALT-006', type: 'low', title: 'New Dataset Uploaded', message: 'Dataset "welfare_q4_2024.csv" processed — 2,450 records analyzed', time: '1 day ago', read: true },
];

export const fraudTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Fraud Cases Detected',
      data: [45, 62, 78, 91, 85, 110, 134, 128, 156, 172, 145, 189],
      borderColor: '#ff0055',
      backgroundColor: 'rgba(255, 0, 85, 0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ff0055',
      pointRadius: 4,
    },
    {
      label: 'Cases Cleared',
      data: [38, 55, 60, 70, 72, 90, 100, 115, 130, 140, 120, 160],
      borderColor: '#00ff88',
      backgroundColor: 'rgba(0, 255, 136, 0.05)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#00ff88',
      pointRadius: 4,
    }
  ]
};

export const riskDistributionData = {
  labels: ['Low Risk (0-30)', 'Medium Risk (31-60)', 'High Risk (61-100)'],
  datasets: [{
    data: [62, 24, 14],
    backgroundColor: [
      'rgba(0, 255, 136, 0.7)',
      'rgba(255, 193, 7, 0.7)',
      'rgba(255, 0, 85, 0.7)',
    ],
    borderColor: ['#00ff88', '#ffc107', '#ff0055'],
    borderWidth: 2,
  }]
};

export const fraudBySchemeData = {
  labels: ['PM-KISAN', 'NREGA', 'PM-AWY', 'PMJDY', 'NSAP', 'Others'],
  datasets: [{
    label: 'Fraud Cases',
    data: [340, 280, 195, 160, 120, 85],
    backgroundColor: [
      'rgba(255, 0, 85, 0.7)',
      'rgba(255, 107, 53, 0.7)',
      'rgba(139, 92, 246, 0.7)',
      'rgba(0, 212, 255, 0.7)',
      'rgba(255, 193, 7, 0.7)',
      'rgba(0, 255, 136, 0.7)',
    ],
    borderColor: ['#ff0055', '#ff6b35', '#8b5cf6', '#00d4ff', '#ffc107', '#00ff88'],
    borderWidth: 2,
  }]
};

export const claimAnomalyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Avg Claim Amount (₹K)',
      data: [12, 14, 13, 15, 18, 22, 35, 28, 32, 45, 38, 52],
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0, 212, 255, 0.08)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    },
    {
      label: 'Anomaly Score',
      data: [12, 15, 14, 18, 25, 30, 65, 48, 55, 78, 60, 85],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.08)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1',
    }
  ]
};

export const regionData = {
  labels: ['Delhi', 'Maharashtra', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Tamil Nadu', 'Karnataka', 'Rajasthan'],
  datasets: [{
    label: 'Fraud Cases by Region',
    data: [245, 198, 312, 276, 167, 143, 128, 98],
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
    borderColor: '#00d4ff',
    borderWidth: 2,
    borderRadius: 6,
  }]
};

export const mockDatasets = [
  { id: 'DS-001', name: 'welfare_q4_2024.csv', records: 2450, uploadDate: '2024-03-10', status: 'Analyzed', fraudFound: 187, scheme: 'PM-KISAN' },
  { id: 'DS-002', name: 'nrega_beneficiaries_2024.xlsx', records: 8932, uploadDate: '2024-03-08', status: 'Processing', fraudFound: 0, scheme: 'NREGA' },
  { id: 'DS-003', name: 'pmay_claims_q3.csv', records: 1205, uploadDate: '2024-03-05', status: 'Analyzed', fraudFound: 94, scheme: 'PM-AWY' },
  { id: 'DS-004', name: 'pension_data_2024.csv', records: 4500, uploadDate: '2024-02-28', status: 'Analyzed', fraudFound: 312, scheme: 'NSAP' },
];

export const mockCases = [
  { id: 'CASE-001', beneficiary: 'Ramesh Kumar', assignedTo: 'Analyst A', fraudType: 'Duplicate Identity', riskScore: 87, status: 'Confirmed Fraud', priority: 'High', notes: 'Two UIDs linked to same biometric hash', lastUpdated: '2024-03-10' },
  { id: 'CASE-002', beneficiary: 'Priya Singh', assignedTo: 'Analyst B', fraudType: 'Shared Bank Account', riskScore: 94, status: 'Confirmed Fraud', priority: 'Critical', notes: 'Bank account used by 3 beneficiaries simultaneously', lastUpdated: '2024-03-09' },
  { id: 'CASE-003', beneficiary: 'Arjun Mehta', assignedTo: 'Field Officer 1', fraudType: 'Anomalous Claim', riskScore: 45, status: 'Under Investigation', priority: 'Medium', notes: 'Field verification scheduled', lastUpdated: '2024-03-08' },
  { id: 'CASE-004', beneficiary: 'Deepak Verma', assignedTo: 'Analyst A', fraudType: 'Shared Address + Phone', riskScore: 81, status: 'Under Investigation', priority: 'High', notes: '5 beneficiaries registered at same address with identical phones', lastUpdated: '2024-03-07' },
  { id: 'CASE-005', beneficiary: 'Sunita Devi', assignedTo: 'Analyst C', fraudType: 'Shared Bank Account', riskScore: 76, status: 'Under Investigation', priority: 'High', notes: 'Cross-scheme fraud suspected', lastUpdated: '2024-03-06' },
];

export const overviewStats = {
  totalBeneficiaries: 284750,
  fraudDetected: 1847,
  highRisk: 423,
  accuracy: 96.4,
  totalRecovered: 2.4,
  activeAlerts: 12,
  datasetsAnalyzed: 24,
  casesResolved: 1289
};
