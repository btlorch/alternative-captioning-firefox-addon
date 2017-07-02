/***  Helper functions ***/
function onError(error) {
  console.log("Error: ${error}");
}

/**
 * Serializes a dictionary for use in a URL query string
 */
function urlSerialize(obj) {
  var str = [];
  for(var p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}

/**
 * Determines whether a given complex object has some property given as list of arguments
 */
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
    // Otherwise consider it as an object
    else if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}

/*** Tag substitution ***/
function insertImageCaption(imageTag, subscriptionKey) {
  var uriBase = "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze";

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
		// Prepend with note that the caption is not necessarily correct
		var newAlternativeText = "Image may show: " + text;
		// Preserve old alternative attribute
		if (imageTag.hasAttribute("alt")) {
			newAlternativeText = imageTag.getAttribute("alt") + "; " + newAlternativeText;
		}
        imageTag.setAttribute("alt", newAlternativeText);
      });
    } else {
      console.log("Failed to fetch request " + response.status);
    }
  }).catch(function(response) {
    console.log(response);
  });
}

/**
 * Loads the Vision API subscription key from browser's storage
 */
function loadPreferences(onFinishedCallback, onErrorCallback) {
  browser.storage.local.get("subscriptionKey").then((response) => {
    if (!hasProperty(response, "subscriptionKey")) {
      console.log("Please enter your substitution key for the Vision API in the addon's preferences menu");
      return;
    }
    onFinishedCallback(response.subscriptionKey);
  }, onErrorCallback);
}

/**
 * Finds all img tags on the document and check their alt attributes
 */
function insertImageCaptions(subscriptionKey) {
  // TODO update tags that are loaded on runtime
  var imageTags = document.body.getElementsByTagName("img");
  for (var i=0; i<imageTags.length; i++) {
    insertImageCaption(imageTags[i], subscriptionKey);
  }
}

// Main method
loadPreferences(insertImageCaptions, onError);