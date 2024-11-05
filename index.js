if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('Service worker registered:', registration);
    }).catch(function(error) {
      console.log('Could not register service worker', error);
    });
  }

// Two first are unrelated books for my tests
const expectedIsbn = ["9782290002964", "9782290353073", "9782251442501", "9782073034625", "9782251444246", "9782100857630", "9782072757495", "9791032919811", "9782757439890", "9782321016687", "9782080219886", "9782711624997", "9782348041877", "9782072841682", "9791032927120", "9782260053255", "9791036202469", "9782226487889", "9782711627615", "9782711626878", "9782130830252", "9782711629831", "9782711630257", "9782080419903", "9782748903997", "9782378560829", "9782711629350", "9782204149969", "9782753595323", "9791032930014", "9782367510194", "9782073036698", "9782130855668", "9782356879707", "9782073010032", "9782226481238", "9782080427915", "9782348082610", "9782330195748", "9782021544053", "9791041415526", "9791030707069", "9791040119050", "9782021541663", "9791040116165", "9791040118978", "9782890918474", "9782377293391", "9791097088736", "9791040118916", "9782330195403", "9782354802929", "9782493909749", "9782330196714", "9782369354079", "9782021544350", "9782021544862", "9782259319072", "9782370735027", "9782385320560", "9782021568950", "9782380945331", "9782330195410", "9782228937597", "9782355222146", "9791097088729", "9782382847299", "9782373091304", "9791040119012", "9791094512395", "9782130848943", "9782743629120", "9782253941118", "9782290377789", "9782080432551", "9782743660680", "9782290390740", "9791041410309", "9782348084621", "9791020907363", "9782226491367", "9782021548068", "9782815961981", "9791038702370", "9782080455451", "9782330194635", "9782815955034", "9791041412334", "9791041416875", "9782073058478", "9782707355553", "9782251456447", "9782493909756", "9782080463753", "9782100874552", "9791037505897", "9782385940089", "9782021566000", "9782354803025", "9788869764271", "9782253908692", "9782080421715", "9782073010230", "9782021497472", "9791037509154", "9782100862573", "9782021534894", "9782381140780", "9782897129620", "9782100866809", "9782385940072", "9791041412099", "9782226494887", "9782385940065", "9791041421497", "9782021525977", "9782021518085", "9782253246930", "9782021545982", "9782377290956", "9782021483505", "9791020923493", "9791041414956", "9782080436535", "9782490205011", "9782757889664", "9782021544732", "9782757889657", "9782021536027", "9782246825562", "9782253079699", "9782253122111", "9782746526594", "9782711614226", "9782749212586", "9782081478879", "9782070771189", "9782348067778", "9782749268057", "9791041414727", "9782900818367", "9782757842249", "9782757896891", "9782757857809", "9782757861073", "9782020403641", "9782379244087", "9782728806058", "9782959293900", "9782266176897", "9782859446208", "9782070345861", "9782493117281", "9782749506418", "9782359251340", "9782130876014", "9782081255845", "9782213725864", "9782369563181", "9782130620709", "9782226480361", "9782130625902", "9782757892190", "9782757869673", "9782227492653", "9782226490339", "9782493117175", "9782749263489", "9782866458690", "9782841623914", "9782021547139", "9782757840023", "9782757863138", "9782757606162", "9782348082528", "9782757867518", "9782748902990", "9782841860722", "9782753512061", "9782204099318", "9782021544220", "9791097088439", "9782900818251", "9782226440754", "9782724611809", "9782705665760", "9782746527843", "9782226314970", "9782724642285", "9782844689702", "9782749269733", "9782749276779", "9782749281582", "9782490205165", "9782348082085", "9782749281070", "9782021490442", "9791035108984", "9782080295064", "9782296124172", "9782749262864", "9782226480866", "9782742742196", "9782253262718", "9782253259718", "9782253941767", "9782850611797", "9782729848682", "9782729860608", "9782359252606", "9782213711386", "9782845977617", "9782707189011", "9782070444151", "9782081293977", "9782253091776", "9782080436511", "9782383411062", "9782376071716", "9782358720939", "9782348076886", "9782369355939", "9782348083204", "9782021508581", "9782252040522", "9782845977754", "9782226483379", "9782081283220", "9782020913553", "9782227482395", "9791037038289", "9782296127326", "9782021056983", "9782757896907", "9782021538557", "9782757859599", "9782707193599", "9782213725987", "9782213705958", "9782213702179", "9782271125859", "9782356876591", "9782072980329", "9782918193784", "9782918193425", "9782918193661", "9782918193456", "9782917855812", "9782415007089", "9782738125224", "9782021026733", "9782738146991", "9791035108519", "9782130855729", "9782830917444", "9782130844631", "9782130815402", "9782021378863", "9782213712468", "9782350307350", "9782955777091", "9782910846794", "9782226491442", "9782226491435", "9782226490346", "9791037512642", "9791036360572", "9782490984060", "9782490984053", "9782204152167", "9782204156936", "9782367176062", "9782271151346", "9782376650409", "9782354281540", "9782220088143", "9782100869442", "9782358722490", "9782213701738", "9782213651347", "9782213712611", "9782073057570", "9782075173629", "9782348077043", "9782707181978", "9782348081309", "9782348081040", "9782873175962", "9782711036073", "9782711030828", "9791020923561", "9791040110910", "9791022610438", "9791022613613", "9791022612258", "9791022613989", "9791022613750", "9782493458025", "9782493458049", "9782380944112", "9782355261961", "9782228936248", "9782228936996", "9782757896884", "9782757896846", "9782757841846", "9791041417315", "9782378964085", "9782753585966", "9782130861263", "9782130855309", "9782130841883", "9782130736387", "9782130847496", "9782715412965", "9782715418059", "9782715420274", "9782372343022", "9782848767253", "9782957157402", "9782221273692", "9782020993685", "9782021497113", "9782234097148", "9791021057692", "9782262109028", "9782378561680", "9782378560720", "9782711630349", "9782711628209", "9782711630882", "9791095630746", "9782955382288", "9782330190316", "9782757872529", "9782130863137", "9782729708870", "9788869763427", "9782912107688", "9782271137029", "9782490070237", "9782818507759", "9782876732490", "9782130796039", "9783330871830", "9782130844204", "9782130800576", "9782715416130", "9782130829201", "9782021552263", "9782365122931", "9791041410002", "9782354802974"];
var notyf = new Notyf();
// "https://cp-api.hfabre.ovh/"
// "http://localhost:4567/"
const baseUrl = "https://cp-api.hfabre.ovh/";
var inProgress = 0;

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
        await new Promise(r => setTimeout(r, 750));
    }
}

async function drawbackBook(token, barcode, sheetName) {
    const response = await fetch(baseUrl + "drawback-book", {
        method: "PUT",
        body: JSON.stringify({
            token: token,
            isbn: barcode,
            sheet_name: sheetName
        }),
      });

    if (response.status == 200) {
        return { success: true, msg: "Successfully drawback book" }
    } else {
        return { success: false, msg: "Failed to drawback " + barcode + " from the spreadsheet: " + response.status + "(" + response.body + ")" }
    }
}

function changeMode(mode) {
    if (mode === "drawback") {
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
        document.getElementById("current-mode").innerText = "Traitement achats"
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

    if (token === "" || sheetName === "" || barcode === "") {
        notyf.error("Make sure token, barcode and sheet name are filled");
        document.getElementById("drawback").disabled = false;
        return;
    }

    if (expectedIsbn.indexOf(barcode) != -1) {
        addISBNOffline(token, barcode, sheetName);
        document.getElementById("barcode").value = "";
    } else {
        notyf.error("ISBN not found in the list, try scanning again");
    }

    document.getElementById("drawback").disabled = false;
}

function clearLocalStorage() {
    document.getElementById("local-storage-data").innerHTML = "";
    localStorage.setItem("isbnQueue", JSON.stringify([]));
}

async function drawbackFromLocalStorage() {
    const saveButton = document.getElementById("drawback-from-local-storage");
    const clearButton = document.getElementById("clear");

    saveButton.disabled = true;
    clearButton.disabled = true;

    let isbnQueue = JSON.parse(localStorage.getItem("isbnQueue")) || [];
    const count = isbnQueue.length;

    if (count > 0) {
        saveButton.innerText = "Processing " + count + " request(s)";

        for (const [index, entry] of isbnQueue.entries()) {
            const result = await drawbackBook(entry.token, entry.barcode, entry.sheetName);

            if(result.success) {
                document.getElementById("isbn-" + index + "-status").innerText = "Success"
                document.getElementById("isbn-" + index + "-status").classList.add("status-success");
            } else {
                document.getElementById("isbn-" + index + "-status").innerText = "Failure: " + result.msg
                document.getElementById("isbn-" + index + "-status").classList.add("status-error");
            }

            // API should implement exponential backoff strategy
            await new Promise(r => setTimeout(r, 1000));
            saveButton.innerText = "Processing " + (count - index) + " request(s)";
        }

        saveButton.innerText = "Save all";
    }

    saveButton.disabled = false;
    clearButton.disabled = false;
}
