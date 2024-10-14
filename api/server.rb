require "googleauth"
require "google/apis/sheets_v4"

class SpreadsheetUpdater
  SCOPE = ["https://www.googleapis.com/auth/spreadsheets"].freeze

  def initialize(sheet_name, spreadsheet_id, cred_path = "credentials.json")
    @authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open(cred_path),
      scope: SCOPE
    )
    @authorizer.fetch_access_token!
    @sheets_service = Google::Apis::SheetsV4::SheetsService.new
    @sheets_service.authorization = @authorizer
    @spreadsheet_id = spreadsheet_id
    @sheet_name = sheet_name
  end

  def push_column_values(values)
    range = "#{@sheet_name}!A:B"
    response = @sheets_service.get_spreadsheet_values(@spreadsheet_id, range)
    last_row = response.values.nil? || response.values.empty? ? 0 : response.values.length
    new_row = last_row + 1
    new_range = "#{@sheet_name}!A#{new_row}:B#{new_row}"

    value_range_object = Google::Apis::SheetsV4::ValueRange.new(
      range: new_range,
      values: [values]
    )

    response = @sheets_service.update_spreadsheet_value(
      @spreadsheet_id,
      new_range,
      value_range_object,
      value_input_option: "RAW"
    )
    puts "#{response.updated_cells} cells updated."
  rescue Google::Apis::Error => e
    puts "Error : #{e.message}"
  end
end

require "json"
require "sinatra"
require "sinatra/cors"

set :allow_origin, "*"
set :allow_methods, "PUT,OPTIONS"
set :allow_headers, "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, if-modified-since"
set :expose_headers, "location,link"

service = SpreadsheetUpdater.new(ENV.fetch("SHEET_NAME"), ENV.fetch("SHEET_ID"), ENV.fetch("CREDENTIALS_PATH"))

put "/update" do
  payload = JSON.parse(request.body.read)
  halt 401 if payload["token"] != ENV.fetch("TOKEN")
  service.push_column_values(payload["values"])
end
