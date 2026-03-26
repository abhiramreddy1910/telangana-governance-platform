import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def send_email(to_email, complaint):
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        raise ValueError("Missing SENDER_EMAIL or SENDER_PASSWORD in .env")

    subject = f"Complaint Registered - ID {complaint.id}"

    body = f"""
Dear {complaint.citizen_name},

Your complaint has been successfully registered.

Complaint ID: {complaint.id}
Title: {complaint.title}
Category: {complaint.category}
Department: {complaint.department}
Status: {complaint.status}

Thank you,
Telangana Governance Platform
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)