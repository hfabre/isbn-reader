require "googleauth"
require "google/apis/sheets_v4"

class SpreadsheetUpdaterError < StandardError; end

class SpreadsheetUpdater
  SCOPE = ["https://www.googleapis.com/auth/spreadsheets"].freeze

  def initialize(spreadsheet_id, cred_path = "credentials.json")
    @authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open(cred_path),
      scope: SCOPE
    )
    @authorizer.fetch_access_token!
    @sheets_service = Google::Apis::SheetsV4::SheetsService.new
    @sheets_service.authorization = @authorizer
    @spreadsheet_id = spreadsheet_id
  end

  def push_column_values(sheet_name, isbn, name)
    range = "#{sheet_name}!A:C"
    response = @sheets_service.get_spreadsheet_values(@spreadsheet_id, range)
    last_row = response.values.nil? || response.values.empty? ? 0 : response.values.length
    new_row = last_row + 1
    new_range = "#{sheet_name}!A#{new_row}:C#{new_row}"

    value_range_object = Google::Apis::SheetsV4::ValueRange.new(
      range: new_range,
      values: [[isbn, name, 1]]
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
    raise SpreadsheetUpdaterError.new("#{e}")
  end

  def add_quantity(sheet_name, isbn, name)
    range = "#{sheet_name}!A:C"
    response = @sheets_service.get_spreadsheet_values(@spreadsheet_id, range)
    rows = response.values || []

    row_to_update = rows.find_index { |row| row[0] == isbn }

    if row_to_update
      # Si l'ISBN existe, on met à jour la quantité (colonne C)
      quantity = rows[row_to_update][2].to_i + 1
      update_range = "#{sheet_name}!C#{row_to_update + 1}"

      value_range_object = Google::Apis::SheetsV4::ValueRange.new(
        range: update_range,
        values: [[quantity]]
      )
      @sheets_service.update_spreadsheet_value(
        @spreadsheet_id,
        update_range,
        value_range_object,
        value_input_option: "RAW"
      )
      puts "Quantity updated"
    else
      # Si l'ISBN n'existe pas, on ajoute une nouvelle ligne avec quantité 1
      push_column_values(sheet_name, isbn, name)
    end
  rescue Google::Apis::Error, SpreadsheetUpdaterError => e
    puts "Error : #{e.message}"
    raise SpreadsheetUpdaterError.new("#{e}")
  end
end

require "json"
require "sinatra"
require "sinatra/cors"

set :allow_origin, "*"
set :allow_methods, "PUT,OPTIONS"
set :allow_headers, "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept, if-modified-since"
set :expose_headers, "location,link"

service = SpreadsheetUpdater.new(ENV.fetch("SHEET_ID"), ENV.fetch("CREDENTIALS_PATH"))

put "/add-book" do
  payload = JSON.parse(request.body.read)
  halt 401, {error: "Bad token"}.to_json if payload["token"] != ENV.fetch("TOKEN")

  puts payload
  service.add_quantity(payload["sheet_name"], payload["isbn"], payload["title"])
rescue SpreadsheetUpdaterError => e
  halt(400, {error: e.message}.to_json)
end
