function insertChuckNorrisJoke(imageTag) {
  const requestURL = "http://api.icndb.com/jokes/random";
  const requestHeaders = new Headers();
  //requestHeaders.append('Authorization', 'Bearer ' + accessToken);

  const driveRequest = new Request(requestURL, {
    method: "GET",
    headers: requestHeaders,
    mode: 'no-cors'
  });

  return fetch(driveRequest).then((response) => {
    if (response.status === 200) {
      promise = response.text();
      promise.then((jsonResult) => {
        const result = JSON.parse(jsonResult);
        const success = result["type"] === "success";
        var joke = result["value"]["joke"];
        imageTag.setAttribute("alt", joke);
      });
    } else {
      alert("Failed to fetch request");
      console.log("Failed to fetch request");
      console.log(response.status);
    }
  });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function loadPreferences(onFinishedCallback, onErrorCallback) {
  function onPreferencesLoaded() {
    if (username === "" || key === "") {
      return;
    }

    onFinishedCallback(username, key);
  }

  var username = "";
  var key = "";
  browser.storage.local.get("username").then((result) => {
    username = result.username;
    onPreferencesLoaded();
  }, onErrorCallback);
  browser.storage.local.get("key").then((result) => {
    key = result.key;
    onPreferencesLoaded();
  }, onErrorCallback);
}

function insertJokes(username, key) {
  // TODO update tags that are loaded on runtime
  var imageTags = document.body.getElementsByTagName("img");
  for (var i=0; i<imageTags.length; i++) {
    insertChuckNorrisJoke(imageTags[i]);
  }
}

// Main method:
loadPreferences(insertJokes, onError);