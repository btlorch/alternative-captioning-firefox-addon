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

// TODO update tags that are loaded on runtime
var imageTags = document.body.getElementsByTagName("img");
for (var i=0; i<imageTags.length; i++) {
  insertChuckNorrisJoke(imageTags[i]);
}
