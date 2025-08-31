from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from spoof_detection.api.utils.detect import detect_spoof  # ✅ Ensure this path is correct for your project

app = FastAPI()

# Allow frontend (Vite/React) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    result = detect_spoof(audio_bytes)
    return {"prediction": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
