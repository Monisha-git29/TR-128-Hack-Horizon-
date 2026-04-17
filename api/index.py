# api/index.py

def handler(request):
    path = request.get("query", {}).get("path")

    if path == "hello":
        return {
            "statusCode": 200,
            "body": '{"msg":"Hello from backend"}'
        }

    return {
        "statusCode": 200,
        "body": '{"message":"Backend working 🚀"}'
    }