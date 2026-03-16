from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
import pandas as pd
import numpy as np
import networkx as nx
from typing import List, Dict

class FraudDetectionEngine:
    def __init__(self):
        self.iso_forest = IsolationForest(contamination=0.05, random_state=42)
        self.dbscan = DBSCAN(eps=0.5, min_samples=2)

    def analyze_dataset(self, df: pd.DataFrame) -> List[Dict]:
        """
        Runs full AI fraud analysis on the dataset.
        Returns a list of records with risk scores and fraud indicators.
        """
        # 1. Feature Engineering for ML
        # Numerical features for Isolation Forest
        numerical_cols = ['claim_amount']
        # Encode categorical features for anomaly detection (simplified for demo)
        df_ml = df[numerical_cols].copy()
        
        # 2. Anomaly Detection (Isolation Forest)
        df['anomaly_score'] = self.iso_forest.fit_predict(df_ml)
        # Convert -1 (anomaly), 1 (normal) to 0-100 score
        # Decision function returns raw scores where lower is more anomalous
        raw_scores = self.iso_forest.decision_function(df_ml)
        # Normalize to 0-100 (where 100 is most anomalous)
        min_s, max_s = raw_scores.min(), raw_scores.max()
        df['risk_score_ml'] = 100 * (1 - (raw_scores - min_s) / (max_s - min_s + 1e-6))

        # 3. Duplicate/Shared Attribute Detection (DBSCAN + Logic)
        # Detect shared bank accounts, addresses, phones
        df['fraud_type'] = ""
        
        # Identity Logic Checks
        dup_bank = df[df.duplicated('bank_account', keep=False)]
        df.loc[dup_bank.index, 'fraud_type'] += " | Shared Bank Account"
        
        dup_id = df[df.duplicated('national_id', keep=False)]
        df.loc[dup_id.index, 'fraud_type'] += " | Duplicate ID"

        # 4. Graph Network Analysis (NetworkX)
        G = nx.Graph()
        for idx, row in df.iterrows():
            G.add_node(row['id'], type='beneficiary')
            G.add_edge(row['id'], row['bank_account'])
            G.add_edge(row['id'], row['phone'])
            G.add_edge(row['id'], row['address'])

        # Find connected components (clusters)
        components = list(nx.connected_components(G))
        suspicious_clusters = [c for c in components if len([n for n in c if G.nodes[n].get('type') == 'beneficiary']) > 1]
        
        for cluster in suspicious_clusters:
            beneficiaries = [n for n in cluster if G.nodes[n].get('type') == 'beneficiary']
            for b_id in beneficiaries:
                df.loc[df['id'] == b_id, 'fraud_type'] += " | Part of suspicious cluster"
                df.loc[df['id'] == b_id, 'risk_score_ml'] += 20

        # 5. Final Risk Score normalization
        df['risk_score'] = df['risk_score_ml'].clip(0, 100)
        df['fraud_type'] = df['fraud_type'].str.lstrip(' | ')
        
        return df.to_dict('records')

    def get_risk_level(self, score: float) -> str:
        if score >= 60: return "High"
        if score >= 30: return "Medium"
        return "Low"
