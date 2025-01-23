import os
from pathlib import Path

from flask import Flask, jsonify
from flask_cors import CORS
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class SheetEditClass:
    def __init__(self):
        self.SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
        self.SPREADSHEET_ID = "1IH9uOjaugzWZhqCEGfyf7B3Qe4uB9TjmMMmIpm5KzeA"
        self.app = Flask(__name__)
        self.cors = CORS(self.app)
        self.init_routes()
    
    def init_routes(self):
        """Function that initialize the flask routes"""
        @self.app.route("/get-sheet")
        def read_sheet(**kwargs):
            """Function to see the chart"""
            credentials = None
            try:
                # Existing token check
                if os.path.exists("token.json"):
                    try:
                        credentials = Credentials.from_authorized_user_file("token.json", self.SCOPES) # save credentials on a variable 
                    except ValueError as ve:
                        print(f"Token file error: {ve}")
                        credentials = None

                
                if not credentials or not credentials.valid:
                    if credentials and credentials.expired and credentials.refresh_token:
                        try:
                            credentials.refresh(Request()) #Ask for new credentials
                        except Exception as refresh_error:
                            print(f"Refresh error: {refresh_error}")
                            credentials = None

                    if not credentials: # Search for the credentials
                        path_credentials = Path("C:/Users/xxjav/Documents/python_things/google-drive-things/src/sheets/credentials/credentials.json")
                        print(f"Looking for credentials at: {path_credentials}") 
                        
                        if not os.path.exists(path_credentials):
                            raise FileNotFoundError(f"Credentials file not found at {path_credentials}")

                        flow = InstalledAppFlow.from_client_secrets_file(path_credentials, self.SCOPES)
                        credentials = flow.run_local_server( #Ask for authorize access to use the Google API
                            port=50701, 
                            authorization_prompt_message='Please authorize access',
                            prompt='consent'  # Force new token generation
                        )

                # Save new or refreshed credentials
                with open("token.json", "w") as token:
                    token.write(credentials.to_json())

                # Fetch sheet data
                service = build("sheets", "v4", credentials=credentials)
                sheets = service.spreadsheets()
                result = sheets.values().get(spreadsheetId=self.SPREADSHEET_ID, range="expenses!A:G").execute()
                values = result.get('values', [])
                
                return jsonify(values)

            except Exception as e:
                print(f"Full error details: {e}")
                return jsonify({"error": str(e)}), 500
    
    def run(self, debug = False):
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
        self.app.run(debug = debug)
