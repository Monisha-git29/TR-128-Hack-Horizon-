import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

print("Generating dummy Isolation Forest model with wide baseline...")
# Since BTC fluctuates heavily, we create a wider spread of "normal" data
# so that the demo model only triggers occasionally.
# Normal data ranging heavily from 50k to 90k
np.random.seed(42)
normal_price = np.random.uniform(50000, 90000, 1000)
normal_volume = np.random.uniform(0.001, 2.0, 1000)
normal_data = np.column_stack((normal_price, normal_volume))

# True extreme anomalies
anomaly_price = np.random.uniform(98000, 120000, 50)
anomaly_volume = np.random.uniform(5.0, 50.0, 50)
anomalies = np.column_stack((anomaly_price, anomaly_volume))

X_train = np.vstack([normal_data, anomalies])

# Train model. Contamination is the estimated proportion of outliers
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X_train)

joblib.dump(model, 'isolation_forest_model.joblib')
print("Saved dummy model to isolation_forest_model.joblib")
