function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    username: document.querySelector("#username").value,
    key: document.querySelector("#key").value
  });
}

function restoreOptions() {

  function setCurrentUsername(result) {
    document.querySelector("#username").value = result.username || "INSERT API USERNAME HERE";
  }

  function setCurrentKey(result) {
    document.querySelector("#key").value = result.key || "INSERT API KEY HERE";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getUsername = browser.storage.local.get("username");
  var getKey = browser.storage.local.get("key");
  getUsername.then(setCurrentUsername, onError);
  getKey.then(setCurrentKey, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);