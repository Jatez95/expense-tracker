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
        self.SPREADSHEET_ID = "1khGexPl2cTuwudNEVCHco6W7xxfu8IJQxx4Sr1IuRlk"
        self.app = Flask(__name__)
        self.cors = CORS(self.app)
        self.init_routes()
    
    def init_routes(self):

        @self.app.route("/get-sheet")
        def read_sheet(**kwargs):
            credentials = None
            if os.path.exists("token.json"):
                credentials = Credentials.from_authorized_user_file("token.json", self.SCOPES)
        
            if not credentials or not credentials.valid:
                if credentials and credentials.expired and credentials.refresh_token:
                    credentials.refresh(Request())
                else:
                    try:
                        path_credentials = Path("C:/Users/xxjav/Documents/python_things/google-drive-things/src/sheets/credentials/credentials.json")
                        print(f"Looking for file at: {path_credentials}")
                        print(f"File exists: {os.path.exists(path_credentials)}")
                        flow = InstalledAppFlow.from_client_secrets_file(path_credentials, self.SCOPES)
                        credentials = flow.run_local_server(port=50701, authorization_prompt_message='Please authorize access')
                    except FileNotFoundError as er:
                        print(f"The file {path_credentials} was not found")

            with open("token.json", "w") as token:
                token.write(credentials.to_json())
        
            try:
                service = build("sheets", "v4", credentials = credentials)
                sheets = service.spreadsheets()


                result = sheets.values().get(spreadsheetId = self.SPREADSHEET_ID, range="May-2024!B2:H9").execute()
                values = result.get('values', [])
                
                return jsonify(values)
             
            except HttpError as e:
                print(f"")
    
    def run(self, debug = False):
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
        self.app.run(debug = debug)
