# detect.py (example logic)
from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import torch

def detect_spoof(audio_bytes):
    # Save or load audio temporarily
    with open("temp.wav", "wb") as f:
        f.write(audio_bytes)

    wav = preprocess_wav("temp.wav")
    encoder = VoiceEncoder()
    embedding = encoder.embed_utterance(wav)

    # Load saved real embeddings (voice_embeddings.npy)
    known_embeddings = np.load("models/voice_embeddings.npy")

    # Cosine similarity check (or use classifier)
    similarity = np.dot(embedding, known_embeddings.T)

    # Simple threshold for demo
    if np.max(similarity) > 0.75:
        return "Genuine"
    else:
        return "Spoofed"
