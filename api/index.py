from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Backend working 🚀"}

@app.get("/hello")
async def hello():
    return {"msg": "Hello from backend"}