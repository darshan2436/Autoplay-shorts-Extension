(()=>{
    const API_KEY = 'AIzaSyDOmQJuQmWR4TxFQz-T7MJlmBpZLJ6pS2w'
    let start;

    function getSeconds(duration){
        if(duration.length > 4){
            return duration.split("")[2] + duration.split("")[3];
        } else{
            return duration.split("")[2];
        }
    }

    //function to disable loop so it does not replay after the short is finished and next is being loading

     // Simulate click function
    function clickButton() {
        const buttons = document.body.getElementsByClassName("yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-xl yt-spec-button-shape-next--icon-button");
        let index;
        if(buttons.length == 2){
            index = 1;
        } else{
            index = 0;
        }
        buttons[index].click();
    }

    function clickNext(time , startTime){
        const finishTime = new Date().getTime();               
        const timeout = time*1000 - (finishTime-startTime);
        start = setTimeout(clickButton ,timeout)
    }

    async function getvideos(id , startTime){
        clearTimeout(start);
        const url = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${id}&part=contentDetails`;
        try {
            const response = fetch(`${url}`)
            if(!(await response).ok){
                return;
            }
            const json = (await response).json();
            json.then(res => {
                const contentDetails = res.items[0].contentDetails
                const duration = contentDetails.duration;
                const durationInSecond = getSeconds(duration)
                clickNext(durationInSecond , startTime);
            })  
        } catch (error) {
            console.log(error);
        }
    }

    // chrome.tabs.query({currentWindow:true} , logTabse)
    chrome.runtime.onMessage.addListener((obj , sender, response)=>{
        if(obj.type="New"){
            getvideos(obj.videoId , obj.startTime);
        }
    })
})();