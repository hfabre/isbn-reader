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
        // Define video as the video element. You can pass the element to the barcode detector.
        const video = document.getElementById('video');

        // Create a BarcodeDetector for simple retail operations.
        const barcodeDetector = new BarcodeDetector();

        // Get a stream for the rear camera, else the front (or side?) camera.
        video.srcObject = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } });
        video.addEventListener("play", () => scan(barcodeDetector, video));
    })();
};

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
        return response.json()
    }).then(json => {
        notyf.success("Book found")
        title = json.items[0].volumeInfo.title
        document.getElementById("title").value = title
    }).catch(err => {
        notyf.error("Failed to find book: " + err);
        console.log(err)
        document.getElementById("title").value = err
    });
}

function pushBook() {
    const fetchPromise = fetch("https://cp-api.hfabre.ovh/update", {
        method: "PUT",
        body: JSON.stringify({ token: document.getElementById("token").value, values: [document.getElementById("barcode").value, document.getElementById("title").value] }),
      });
    fetchPromise.then(response => {
        if (response.status == 200) {
            notyf.success("Added to the spreadsheet")
            document.getElementById("title").value = ""
            document.getElementById("barcode").value = ""
        } else {
            notyf.error("Failed to add to the spreadsheet: " + response.status);
        }
    }).catch(err => {
        notyf.error("Failed to add to the spreadsheet: " + err);
        console.log(err)
    });
}
