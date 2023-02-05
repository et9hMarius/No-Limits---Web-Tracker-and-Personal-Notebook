let currentUrl = "";
let websiteTrackers = {};
chrome.storage.local.get("websiteTrackers", (data) => {
  websiteTrackers = data.websiteTrackers;
  if (!websiteTrackers) {
    websiteTrackers = {};
  }
});

//keep process always alive
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "keepAlive") {
    sendResponse({ message: "keepAlive" });
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  currentUrl = "";
  console.log("tab activated", activeInfo);
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    let url = tab.url;
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
    currentUrl = url;
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  currentUrl = "";
  console.log("tab updated", tabId, changeInfo, tab);
  let url = tab.url;
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
  currentUrl = url;
});
// chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) { });
setInterval(() => {
  if (currentUrl) {
    //get current date in YYYY-MM-DD format
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    //check if current date is present in websiteTrackers
    if (websiteTrackers[today]) {
      if (websiteTrackers[today][currentUrl]) {
        websiteTrackers[today][currentUrl].duration += 1;
      } else {
        websiteTrackers[today][currentUrl] = {
          duration: 1,
        };
      }
    } else {
      websiteTrackers[today] = {};
      websiteTrackers[today][currentUrl] = {
        duration: 1,
      };
    }

    //duration if <60 then show seconds else show minutes if <60 then show hours if <24 then show days
    let duration_string = "";
    if (currentUrl) {
      if (websiteTrackers[today][currentUrl]) {
        let duration = websiteTrackers[today][currentUrl].duration;
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
    }

    chrome.action.setBadgeText({
      text: duration_string,
    });
  } else {
    chrome.action.setBadgeText({
      text: "",
    });
  }
  chrome.storage.local.set({ websiteTrackers: websiteTrackers }, function () {
    console.log(websiteTrackers);
    console.log("Data is stored in storage API");
  });
}, 1000);
