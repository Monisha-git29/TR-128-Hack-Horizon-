import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

print("Generating basic Isolation Forest model...")
# Simulate some crypto price and volume data
np.random.seed(42)
normal_data = np.random.normal(loc=[65000, 1.0], scale=[100, 0.2], size=(1000, 2))
anomalies = np.random.normal(loc=[66000, 5.0], scale=[50, 1.0], size=(50, 2))

X_train = np.vstack([normal_data, anomalies])

# Train model. Contamination is the estimated proportion of outliers
model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X_train)

joblib.dump(model, 'isolation_forest_model.joblib')
print("Saved dummy model to isolation_forest_model.joblib")
