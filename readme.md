# ISBN Reader

This a tiny application mainly made to automate the process of selling book in a non-professinal environment.
You can scan the barcode, then search for the book title and push to an api in charge of storing a new line
in a google spreadsheet to keep track.

## API

The api is a tiny sinatra application. It is in charge of sending the book data (isbn and title) into a given google spreadsheat.
To set it up, you will need to fill some environement variables:

```
SHEET_ID=
SHEET_NAME=
TOKEN=
CREDENTIALS_PATH=
```

`TOKEN` is a value against each call will be validated to ensure you trust the client making the call
`CREDENTIALS_PATH`is the path for your google service account credential paht (generated from google console)

## Application

The application is a simple frontend making use of the new [barcode detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API).
You will have a `Token` field in which you are supposed to fill the API token.
Other field are supposed to be filled automatically, the first scan with the scanned barcode, the second one with the found book title.
And a button to save result (passing it to the API in charge of saving to the spreadsheet)
