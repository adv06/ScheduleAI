import datetime as dt
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import requests

SCOPES = "https://www.googleapis.com/auth/calendar"
def convertToken(code):
  url = "https://oauth2.googleapis.com/token"
  data = {
    "code": code,
    "client_id": "53347310793-8k85ni90qcnv8h8djl4a8u3vt1vkdafi.apps.googleusercontent.com",
    "client_secret":"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",
    "redirect_uri": "http://localhost:8000/",
    "grant_type": "authorization_code",
    "access_type": "offline",
  }
  response = requests.post(url, data = data)
  return response.json()

def runCalender(code):
  creds = None
  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json")
  if not creds or not creds.valid: 
    if creds and creds.expired and creds.refresh_token:
      os.remove("token.json")
      creds.refresh(Request())
  
    else:
      # create creds
      # flow = InstalledAppFlow.from_client_secrets_file("C:/Advey/ScheduleAI/ScheduleAIBackend/API/credentials.json", SCOPES)
      # creds = flow.run_local_server(port = 0)
      converted = convertToken(code)
      print(converted)
      scopes = converted.get("scope", "").split()
      ref = converted["refresh_token"]
      # if not ref:
      #   with open("refresh.txt", "r") as r:
      #     ref = r.readline()
      creds = Credentials(
        token = converted["access_token"],
        refresh_token= ref,
        token_uri= "https://oauth2.googleapis.com/token",
        client_id = "53347310793-8k85ni90qcnv8h8djl4a8u3vt1vkdafi.apps.googleusercontent.com",
        client_secret = "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",
        scopes = scopes
      )
    
    with open("token.json", "w") as token:
      token.write(creds.to_json())
    # with open("refresh.txt", "w") as r:
    #   r.write(ref)
    
  
  print("Credentials:", creds.to_json())
  try:
    service = build("calendar", "v3", credentials=creds)
    event = {
      "summary": "YOOO DUDE SUPPPP",
      "location": "online",
      "description": "details",
      "colorId": 6,
      "start": {
        "dateTime": "2025-1-5T15:00:00-05:00",
        "timeZone": "Canada/Eastern",

      },
       "end": {
          "dateTime": "2025-1-5T17:00:00-05:00",
          "timeZone": "Canada/Eastern",

      },
      "recurrence": [
        "RRULE:FREQ=DAILY;COUNT=3"
      ],
      "attendees": [
        {"email": "adv06@gmail.com"}
      ]
    }
    event = service.events().insert(calendarId="primary", body =event).execute()

  except HttpError as error:
    print(error)
    
