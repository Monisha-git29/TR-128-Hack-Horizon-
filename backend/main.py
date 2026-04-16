import joblib
import pandas as pd
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import websockets
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. LOAD YOUR MODEL gracefully
MODEL_PATH = 'isolation_forest_model.joblib'
if not os.path.exists(MODEL_PATH):
    print(f"Warning: {MODEL_PATH} not found. Please run create_model.py first.")
    model = None
else:
    model = joblib.load(MODEL_PATH)

# limit how often we stream to frontend to avoid overloading it
THROTTLE_MS = 100 

async def stream_and_predict(websocket: WebSocket):
    # Asynchronous websocket connection to Binance
    uri = "wss://stream.binance.com:9443/ws/btcusdt@trade"
    try:
        async with websockets.connect(uri) as binance_ws:
            while True:
                # Receive raw data asynchronously
                msg = await binance_ws.recv()
                data = json.loads(msg)
                
                # Extract features
                price = float(data['p'])
                volume = float(data['q'])
                
                # 3. RUN INFERENCE
                is_anomaly = False
                if model is not None:
                    features = [[price, volume]] 
                    prediction = model.predict(features) # Returns 1 (normal) or -1 (anomaly)
                    is_anomaly = True if prediction[0] == -1 else False
                
                # 4. SEND TO FRONTEND
                payload = {
                    "price": price,
                    "volume": volume,
                    "is_anomaly": is_anomaly,
                    "timestamp": data['E']
                }
                await websocket.send_json(payload)
                await asyncio.sleep(THROTTLE_MS / 1000.0)
    except Exception as e:
        print(f"Binance Stream Error: {e}")
        await websocket.close()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await stream_and_predict(websocket)
