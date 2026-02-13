import os
import json
import pdfplumber
import google.generativeai as genai
from docx import Document
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def parse_resume_with_gemini(resume_text):
    prompt = f"""
    You are an intelligent resume parser.
    Extract the following information from the resume text and return ONLY valid JSON:
    {{
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": []
    }}
    Resume Text:
    {resume_text}
    """
    response = model.generate_content(prompt)
    cleaned = response.text.strip().replace("```json", "").replace("```", "")
    try:
        return json.loads(cleaned)
    except:
        return {"error": "Failed to parse JSON", "raw_output": response.text}

@app.post("/parse_resume/")
async def parse_resume(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        if ext == ".pdf":
            text = extract_text_from_pdf(tmp_path)
        else:
            text = extract_text_from_docx(tmp_path)
        parsed_data = parse_resume_with_gemini(text)
        return parsed_data
    finally:
        os.remove(tmp_path)
