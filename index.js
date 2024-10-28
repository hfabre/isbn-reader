if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('Service worker registered:', registration);
    }).catch(function(error) {
      console.log('Could not register service worker', error);
    });
  }

var notyf = new Notyf();

window.onload = function() {
    (async () => {
        changeMode("drawback")
        startCamera();
    })();
};

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    } else if (document.visibilityState === "visible") {
      startCamera();
    }
});

async function startCamera() {
    const video = document.getElementById('video');
    const barcodeDetector = new BarcodeDetector();
    // Get a stream for the rear camera, else the front (or side?) camera.
    video.srcObject = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
    video.addEventListener("play", () => scan(barcodeDetector, video));
}

async function scan(barcodeDetector, video) {
    // Let's scan barcodes forever
    while(true) {
        // Try to detect barcodes in the current video frame.
        var barcodes = await barcodeDetector.detect(video);

        // Continue loop if no barcode was found.
        if (barcodes.length == 0)
        {
            // Scan interval 50 ms like in other barcode scanner demos.
            // The higher the interval the longer the battery lasts.
            await new Promise(r => setTimeout(r, 50));
            continue;
        }

        // We expect a single barcode.
        // It's possible to compare X/Y coordinates to get the center-most one.
        // One can also do "preferred symbology" logic here.
        document.getElementById("barcode").value = barcodes[0].rawValue;

        notyf.success("Barcode detected")

        // Give the user time to find another product to scan
        await new Promise(r => setTimeout(r, 1000));
    }
}

function searchBook() {
    const fetchPromise = fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + document.getElementById("barcode").value);
    fetchPromise.then(response => {
        if (response.status == 200) {
            return response.json()
        } else {
            notyf.error("Failed to fetch book: " + response.status);
        }
    }).then(json => {
        if (json.totalItems != 0) {
            notyf.success("Book found")
            title = json.items[0].volumeInfo.title
            document.getElementById("title").value = title
        } else {
            notyf.error("Book not found");
            document.getElementById("title").value = "Unknown"
        }
    }).catch(err => {
        notyf.error("Failed to find book: " + err);
        console.log(err)
        document.getElementById("title").value = err
    });
}

function pushBook() {
    // "https://cp-api.hfabre.ovh/add-book"
    const fetchPromise = fetch("http://localhost:4567/add-book", {
        method: "PUT",
        body: JSON.stringify({
            token: document.getElementById("token").value,
            isbn: document.getElementById("barcode").value,
            title: document.getElementById("title").value,
            sheet_name: document.getElementById("sheet-name").value
        }),
      });
    fetchPromise.then(response => {
        if (response.status == 200) {
            notyf.success("Added to the spreadsheet")
            document.getElementById("title").value = ""
            document.getElementById("barcode").value = ""
        } else {
            notyf.error("Failed to add to the spreadsheet: " + response.status, + "(" + response.body + ")");
        }
    }).catch(err => {
        notyf.error("Failed to add to the spreadsheet: " + err);
        console.log(err)
    });
}

function drawbackBook() {
    // "https://cp-api.hfabre.ovh/drawback-book"
    const fetchPromise = fetch("http://localhost:4567/drawback-book", {
        method: "PUT",
        body: JSON.stringify({
            token: document.getElementById("token").value,
            isbn: document.getElementById("barcode").value,
            sheet_name: document.getElementById("sheet-name").value
        }),
      });
    fetchPromise.then(response => {
        if (response.status == 200) {
            notyf.success("Drawback from the spreadsheet")
            document.getElementById("title").value = ""
            document.getElementById("barcode").value = ""
        } else {
            notyf.error("Failed to drawback from the spreadsheet: " + response.status, + "(" + response.body + ")");
        }
    }).catch(err => {
        notyf.error("Failed to drawback from the spreadsheet: " + err);
        console.log(err)
    });
}

function changeMode(mode) {
    if (mode === "store") {
        Array.from(document.getElementsByClassName("drawback")).forEach(element => {
            element.hidden = true
        });

        Array.from(document.getElementsByClassName("store")).forEach(element => {
            element.hidden = false
        });
        document.getElementById("current-mode").innerText = "achat"
    } else if (mode === "drawback") {
        Array.from(document.getElementsByClassName("drawback")).forEach(element => {
            element.hidden = false
        });

        Array.from(document.getElementsByClassName("store")).forEach(element => {
            element.hidden = true
        });
        document.getElementById("current-mode").innerText = "Inventaire"
    }
}
