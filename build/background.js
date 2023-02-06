let websiteTrackers = {};
let currentTabId;
let timer;
chrome.storage.local.get("websiteTrackers", (data) => {
  websiteTrackers = data.websiteTrackers;
  if (!websiteTrackers) {
    websiteTrackers = {};
  }
});

// Get base URL of a website
function getBaseUrl(url) {
  let regex = /^https?:\/\/[^\/]+/i;
  if (url) {
    url = url.match(regex);
    if (url) {
      url = url[0];
    }
  }
  if (url) {
    url = url.replace(/(^\w+:|^)\/\//, "");
  }

  return url;
}

// Start timer for a website
function startTimer(tabId) {
  if (!tabId) return;
  chrome.tabs.get(tabId, function (tab) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    if (!websiteTrackers[today]) {
      websiteTrackers[today] = {};
    }

    let baseUrl = getBaseUrl(tab.url);
    if (!baseUrl) return;
    if (!websiteTrackers[today][baseUrl]) {
      websiteTrackers[today][baseUrl] = {
        duration: 1,
      };
    }
    currentTabId = tabId;

    timer = setInterval(function () {
      if (currentTabId === tabId) {
        if (websiteTrackers[today][baseUrl]) {
          websiteTrackers[today][baseUrl].duration += 1;
        }
      }
      let duration_string = "";
      if (baseUrl) {
        if (websiteTrackers[today][baseUrl]) {
          let duration = websiteTrackers[today][baseUrl].duration;
          if (duration < 60) {
            duration_string = duration + "s";
          } else if (duration < 3600) {
            duration_string = Math.floor(duration / 60) + "m";
          } else if (duration < 86400) {
            duration_string = Math.floor(duration / 3600) + "h";
          } else {
            duration_string = Math.floor(duration / 86400) + "d";
          }
        }
        chrome.action.setBadgeText({
          text: duration_string,
        });
      } else {
        chrome.action.setBadgeText({
          text: "",
        });
      }

      chrome.storage.local.set(
        { websiteTrackers: websiteTrackers },
        function () {
          console.log(websiteTrackers);
          console.log("Data is stored in storage API");
        }
      );
    }, 1000);
  });
}

// Stop timer for a website
function stopTimer(tabId) {
  if (!tabId) return;
  clearInterval(timer);
}

// Listen for changes in active tab
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log(activeInfo.tabId);
  stopTimer(currentTabId);
  startTimer(activeInfo.tabId);
});

// Listen for updates to the URL of a tab
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    stopTimer(currentTabId);
    startTimer(tabId);
  }
});
