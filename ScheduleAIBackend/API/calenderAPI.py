import datetime as dt
import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/calendar"]

def main():
  creds = None

  if os.path.exists("token.json"):
    creds = Credentials.from_authorized_user_file("token.json")
  
  if not creds or not creds.valid: 
    if creds and creds.expired and creds.refresh_token:
      creds.refresh(Request())
  
    else:
      # create creds
      flow = InstalledAppFlow.from_client_secrets_file("C:/Advey/ScheduleAI/ScheduleAIBackend/API/credentials.json", SCOPES)
      creds = flow.run_local_server(port = 0)
    
    with open("token.json", "w") as token:
      token.write(creds.to_json())

  try:
    service = build("calendar", "v3", credentials=creds)
    event = {
      "summary": "python event",
      "location": "online",
      "description": "details",
      "colorId": 6,
      "start": {
        "dateTime": "2024-12-31T15:00:00-05:00",
        "timeZone": "Canada/Eastern",

      },
       "end": {
          "dateTime": "2024-12-31T17:00:00-05:00",
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
    
   
if __name__ == "__main__":
  main()