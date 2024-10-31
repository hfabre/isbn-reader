if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('Service worker registered:', registration);
    }).catch(function(error) {
      console.log('Could not register service worker', error);
    });
  }

var notyf = new Notyf();
// "https://cp-api.hfabre.ovh/"
// "http://localhost:4567/"
const baseUrl = "https://cp-api.hfabre.ovh/";

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
            // Scan interval 200 ms like in other barcode scanner demos.
            // The higher the interval the longer the battery lasts.
            await new Promise(r => setTimeout(r, 200));
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
    document.getElementById("save").disabled = true;
    const fetchPromise = fetch(baseUrl + "add-book", {
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
    document.getElementById("save").disabled = false;
}

function drawbackBook(token, barcode, sheetName) {
    const fetchPromise = fetch(baseUrl + "drawback-book", {
        method: "PUT",
        body: JSON.stringify({
            token: token,
            isbn: barcode,
            sheet_name: sheetName
        }),
      });
    result = fetchPromise.then(response => {
        if (response.status == 200) {
            document.getElementById("title").value = ""
            document.getElementById("barcode").value = ""
            return { success: true, msg: "Successfully drawback book" }
        } else {
            return { success: false, msg: "Failed to drawback " + barcode + " from the spreadsheet: " + response.status + "(" + response.body + ")" }
        }
    }).catch(err => {
        return { success: false, msg: "Failed to drawback " + barcode + " from the spreadsheet: " + err}
    });

    return result;
}

function changeMode(mode) {
    if (mode === "store") {
        document.getElementById("offline").style.display = "none";
        document.getElementById("main").style.display = "";
        Array.from(document.getElementsByClassName("drawback")).forEach(element => {
            element.style.display = "none";
        });

        Array.from(document.getElementsByClassName("store")).forEach(element => {
            element.style.display = "";
        });
        document.getElementById("current-mode").innerText = "Inventaire"
    } else if (mode === "drawback") {
        document.getElementById("offline").style.display = "none";
        document.getElementById("main").style.display = "";
        Array.from(document.getElementsByClassName("drawback")).forEach(element => {
            element.style.display = "";
        });

        Array.from(document.getElementsByClassName("store")).forEach(element => {
            element.style.display = "none";
        });
        document.getElementById("current-mode").innerText = "Achat"
    } else if (mode === "offline") {
        document.getElementById("main").style.display = "none";
        document.getElementById("offline").style.display = "";

        let tableHtml = "<table><thead><tr><th>Token</th><th>ISBN</th><th>Sheet</th><th>Résultat</th></tr></thead><tbody>"

        let isbnQueue = JSON.parse(localStorage.getItem("isbnQueue")) || [];
        if (isbnQueue.length > 0) {
            isbnQueue.forEach((entry, index) => {
                tableHtml += `
                    <tr id="isbn-${index}">
                        <td>${entry.token}</td>
                        <td>${entry.barcode}</td>
                        <td>${entry.sheetName}</td>
                        <td id="isbn-${index}-status"> waiting </td>
                    </tr>
                `;
            });
        }
        tableHtml += "</tbody></table>";

        document.getElementById("local-storage-data").innerHTML = tableHtml;
        document.getElementById("current-mode").innerText = "Hors-ligne"
    }
}

function addISBNOffline(token, barcode, sheetName) {
    let isbnQueue = JSON.parse(localStorage.getItem("isbnQueue")) || [];
    isbnQueue.push({ token, barcode, sheetName });
    localStorage.setItem("isbnQueue", JSON.stringify(isbnQueue));
    notyf.success("ISBN added to offline queue")
}

function drawbackBookOffline() {
    document.getElementById("drawback").disabled = true;

    const token = document.getElementById("token").value;
    const barcode = document.getElementById("barcode").value;
    const sheetName = document.getElementById("sheet-name").value;

    if (navigator.onLine) {
        promise = drawbackBook(token, barcode, sheetName);
        promise.then(result => {
            if(result.success) {
                notyf.success(result.msg)
                document.getElementById("barcode").value = ""
            } else {
                notyf.error(result.msg)
            }
        })
    } else {
        addISBNOffline(token, barcode, sheetName);
    }
    document.getElementById("drawback").disabled = false;
}

function clearLocalStorage() {
    document.getElementById("local-storage-data").innerHTML = "";
    localStorage.setItem("isbnQueue", JSON.stringify([]));
}

function drawbackFromLocalStorage() {
    document.getElementById("drawback-from-local-storage").disabled = true;
    let isbnQueue = JSON.parse(localStorage.getItem("isbnQueue")) || [];
    if (isbnQueue.length > 0) {
        isbnQueue.forEach((entry, index) => {
            promise = drawbackBook(entry.token, entry.barcode, entry.sheetName);
            promise.then(result => {
                if(result.success) {
                    document.getElementById("isbn-" + index + "-status").innerText = "Success"
                    document.getElementById("isbn-" + index + "-status").classList.add("status-success");
                } else {
                    document.getElementById("isbn-" + index + "-status").innerText = "Failure: " + result.msg
                    document.getElementById("isbn-" + index + "-status").classList.add("status-error");
                }
            })
        });
    }
    document.getElementById("drawback-from-local-storage").disabled = false;
}
