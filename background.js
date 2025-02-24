chrome.tabs.onUpdated.addListener((tabId , tab)=>{
    const startTime = new Date().getTime();
    if(tab.url && tab.url.includes("youtube.com/shorts")){
        const id = tab.url.split("/")[4];
        chrome.tabs.sendMessage(tabId,{
            type:"New",
            startTime: startTime,
            videoId: id
        })
    }
})