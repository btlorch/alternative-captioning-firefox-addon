function saveOptions(e) {
  e.preventDefault();

  var subscriptionKey = document.querySelector("#subscriptionKey").value;

  browser.storage.local.set({
    "subscriptionKey": subscriptionKey
  });
}

function restoreOptions() {

  function setSubscriptionKey(result) {
    document.querySelector("#subscriptionKey").value = result.subscriptionKey || ""
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getSubscriptionKey = browser.storage.local.get("subscriptionKey");
  getSubscriptionKey.then(setSubscriptionKey, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);