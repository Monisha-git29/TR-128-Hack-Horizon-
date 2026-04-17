from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend working 🚀"}

@app.get("/hello")
def hello():
    return {"msg": "Hello from backend"}