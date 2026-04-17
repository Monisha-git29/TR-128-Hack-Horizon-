from fastapi import FastAPI, Request

app = FastAPI()

@app.get("/")
async def root(request: Request):
    path = request.query_params.get("path")

    if path == "hello":
        return {"msg": "Hello from backend"}

    return {"message": "Backend working 🚀"}

# required for vercel
handler = app