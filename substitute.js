/***  Helper functions ***/
function onError(error) {
  console.log(`Error: ${error}`);
}

function urlSerialize(obj) {
  var str = [];
  for(var p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

function hasProperty(jsonObject, path) {
  var args = Array.prototype.slice.call(arguments, 1);
  var obj = jsonObject;
  for (var i=0; i<args.length; i++) {
    var arg = args[i];
    // Is the current object an array?
    if (Number.isInteger(arg)) {
      if (!Array.isArray(obj) || arg < 0 || arg >= obj.length) {
        return false;
      }
    }
    // Otherwise parse it as an object
    else if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

/*** Alternative tag substitution ***/
function insertImageCaption(imageTag, subscriptionKey) {
  var uriBase = "http://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze";

  // Request parameters.
  var params = {
      "visualFeatures": "Categories,Description",
      "language": "en",
  };

  // src attribute will always give the full url
  var sourceImageUrl = imageTag.src;
  
  // Set request headers and body
  const requestHeaders = new Headers();
  requestHeaders.append('Content-Type', 'application/json');
  requestHeaders.append("Ocp-Apim-Subscription-Key", subscriptionKey);

  const requestURL = uriBase + "?" + urlSerialize(params);
  const driveRequest = new Request(requestURL, {
    method: "POST",
    headers: requestHeaders,
    mode: 'cors',
    body: '{"url": "' + sourceImageUrl + '"}'
  });

  // Perform API call
  return fetch(driveRequest).then((response) => {
    if (response.status === 200) {
      promise = response.text();
      promise.then((jsonResult) => {
        const result = JSON.parse(jsonResult);
        if (!hasProperty(result, "description", "captions", 0, "text")) {
          console.log("Response does not have a caption");
          return;
        }
        const text = result["description"]["captions"][0]["text"];
        imageTag.setAttribute("alt", text);
      });
    } else {
      console.log("Failed to fetch request " + response.status);
    }
  }).catch(function(response) {
    console.log(response);
  });
}

function loadPreferences(onFinishedCallback, onErrorCallback) {
  browser.storage.local.get("subscriptionKey").then((response) => {
    onFinishedCallback(response.subscriptionKey);
  }, onErrorCallback);
}

function insertImageCaptions(subscriptionKey) {
  // TODO update tags that are loaded on runtime
  var imageTags = document.body.getElementsByTagName("img");
  for (var i=0; i<imageTags.length; i++) {
    insertImageCaption(imageTags[i], subscriptionKey);
  }
}

// Main method
loadPreferences(insertImageCaptions, onError);