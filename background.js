// background.js Ido Shabi 20.12.22
var OnCreate,OnChange;
var weburl;
var useremail;

chrome.storage.managed.get('FileDownloadUrl', function (data) {            
  weburl = data.FileDownloadUrl;
});

chrome.identity.getProfileUserInfo(function(userInfo) 
          {
            useremail = userInfo.email;
          });

function handleData() {
    
    if (OnCreate && OnChange) {
      if ('filename' in OnChange){
        
        const accumulative = {
          ...OnCreate,
          ...OnChange,
          'ActorEmail':useremail,
          'EventType':'Download'
          }
        
        //var webHookUrl=weburl;
        postData(weburl, accumulative);
        OnCreate = void 0;
        OnChange = void 0;
    }
  }
}

async function postData(url, data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
   // parses JSON response into native JavaScript objects
}

function handleCreated(downloadItem) {
  OnCreate = downloadItem;
  handleData();
}

if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.downloads.onCreated.addListener(handleCreated);

function reqListener () {
  console.log();
}

function handleChanged(downloadItem) {
  OnChange = downloadItem; 
  handleData();
}

browser.downloads.onChanged.addListener(handleChanged);

