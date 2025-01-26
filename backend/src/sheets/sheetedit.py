import os
import io
from pathlib import Path
from datetime import date

import flask # import only flask to use flask.module for the overlapped modules
from flask_cors import CORS
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload



class SheetEditClass:
    def __init__(self):
        self.SCOPES = [
            "https://www.googleapis.com/auth/spreadsheets",
            'https://www.googleapis.com/auth/drive',
            "https://www.googleapis.com/auth/drive.readonly"
        ]

        self.SPREADSHEET_ID = "1IH9uOjaugzWZhqCEGfyf7B3Qe4uB9TjmMMmIpm5KzeA"
        self.prefix = 'https://drive.google.com/uc?/export=download&id='
        self.app = flask.Flask(__name__)
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
                
                return flask.jsonify(values) # Everytime you reload the page this is what you get

            except Exception as e:
                print(f"Full error details: {e}")
                return flask.jsonify({"error": str(e)}), 500
            
        
        @self.app.route("/insert-sheet", methods=["POST"])
        def update_values(**kwargs):
            """Function to insert data to the chart"""
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
                
                request = flask.request.get_json()
                print(request)
              
                
                service = build("sheets", "v4", credentials=credentials)
                
                #Genious idea for the select options on the fronend the only problem us the use of formulas
                if request["dataValues"][3] == "50% (Gastos previstos)":
                    values =[
                        [date.today().strftime("%d/%m/%Y"), f"{request["dataValues"][0]}€", "=B-E", request["dataValues"][1], f"{request["dataValues"][2]}€", "50%", "Gastos Previstos"]
                    ] # with the formula there is a problem when updating table shows #NAME? or something
                    # TODO fix it one day i guess
                elif request["dataValues"][3] == "30% (Gastos personales)":
                    values =[
                        [date.today().strftime("%d/%m/%Y"), f"{request["dataValues"][0]}€", "=B-E", request["dataValues"][1], f"{request["dataValues"][2]}€", "30%", "Gastos personales"]
                    ] 
                elif request["dataValues"][3] == "20% (De la parte de ahorro)":
                    values =[
                        [date.today().strftime("%d/%m/%Y"), f"{request["dataValues"][0]}€", "=B-E", request["dataValues"][1], f"{request["dataValues"][2]}€", "20%", "Ahorro"]
                    ]
                elif request["dataValues"][3] == "Añadir":
                    values =[
                        [date.today().strftime("%d/%m/%Y"), request["dataValues"][0], "=B-E", "Añadido", " ", " ", "Añadido"]
                    ]

                body = {"values": values}
                result = (
                    service.spreadsheets()
                    .values()
                    .append(
                        spreadsheetId=self.SPREADSHEET_ID,
                        range="expenses!A:G",
                        valueInputOption="USER_ENTERED",
                        body=body,
                    )
                    .execute()
                )

                print(f"{(result.get('updates').get('updatedCells'))} cells appended.")
                return result
            except Exception as e:
                print(f"Full error details: {e}")
                return request.jsonify({"error": str(e)}), 500
        
        
        @self.app.route("/download-sheet", methods=["GET"])
        def download_sheet():
            """Download the google sheet"""
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

                service = build("drive", "v3", credentials=credentials)

                file_id = self.SPREADSHEET_ID

                request = service.files().export_media(
                    fileId=file_id,
                    mimeType='text/csv'
                )

                file_name = "expenses.csv"
                file_content = request.execute()
                file = io.BytesIO(file_content) # The file here needs to be decoded or will be broken af

                decoded_content = file_content.decode('utf-8') 
                file = io.BytesIO(decoded_content.encode('utf-8')) # UTF-8 encode to our language and not strange symbols
                downloader = MediaIoBaseDownload(file, request)
                done = False
                while done is False: # Dont know why google recomend this but i will use it
                    status, done = downloader.next_chunk()
                    print(f"Download {int(status.progress() * 100)}.") 
                
                file.seek(0)
                return flask.send_file( # claude.ai helped me but not that much
                    file, as_attachment = True, download_name = file_name
                )
                
            except HttpError as error:
                print(f"An error ocurred: {error}")
                return None
        
    
    def run(self, debug = False):
        """initialize the backend if run is clicked on main"""
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
        self.app.run(debug = debug)