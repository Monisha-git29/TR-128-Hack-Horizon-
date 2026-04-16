import joblib
import pandas as pd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import websockets
import os
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. LOAD USER'S NATIVE DETECTOR LOGIC
import sys
sys.path.append(r'd:\SRM trichy\backend')
try:
    from detector import AnomalyDetector
    detector_engine = AnomalyDetector(window_size=100)
except ImportError as e:
    print(f"Warning: Could not import detector: {e}")
    detector_engine = None

# limit how often we stream to frontend to avoid overloading it
THROTTLE_MS = 100 

async def stream_and_predict(websocket: WebSocket):
    # Asynchronous websocket connection to Binance
    uri = "wss://stream.binance.com:9443/ws/btcusdt@trade"
    while True:
        try:
            async with websockets.connect(uri) as binance_ws:
                last_sent_time = 0
                while True:
                    # Receive raw data asynchronously. Must always await to drain buffer!
                    msg = await asyncio.wait_for(binance_ws.recv(), timeout=10.0)
                    
                    current_time = time.time()
                    if (current_time - last_sent_time) * 1000 < THROTTLE_MS:
                        continue # drained message, but skipping frontend send to avoid flooding
                    
                    last_sent_time = current_time
                    data = json.loads(msg)
                    
                    # Extract features
                    price = float(data['p'])
                    volume = float(data['q'])
                    
                    # 3. RUN INFERENCE USING NATIVE DETECTOR
                    is_anomaly = False
                    reason = ""
                    suggestion = ""
                    if detector_engine is not None:
                        res = detector_engine.process_trade(price, volume, data['E'])
                        is_anomaly = res["is_anomaly"]
                        reason = res.get("reason", "")
                        suggestion = res.get("suggestion", "")
                    
                    # 4. SEND TO FRONTEND
                    payload = {
                        "price": price,
                        "volume": volume,
                        "is_anomaly": is_anomaly,
                        "reason": reason,
                        "suggestion": suggestion,
                        "timestamp": data['E']
                    }
                    try:
                        await websocket.send_json(payload)
                    except Exception:
                        print("Frontend disconnected")
                        return # Exit the stream completely if client disconnects
        except asyncio.TimeoutError:
            print("Binance Stream Error: Timeout, reconnecting...")
        except Exception as e:
            print(f"Binance Stream Error: {e}, reconnecting...")
            await asyncio.sleep(2)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await stream_and_predict(websocket)
