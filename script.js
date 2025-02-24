(()=>{
    const API_KEY = YT_API_KEY
    let start;

    //gives the seconds of the video
    function getSeconds(duration){
        if(duration.length > 4){
            return duration.split("")[2] + duration.split("")[3];
        } else{
            return duration.includes("M")? duration.split("")[2] * 60 : duration.split("")[2]
        }
    }

    //function to disable loop so it does not replay after the short is finished and next is being loading
    function disableLoop(){
        const video = document.body.getElementsByClassName("video-stream html5-main-video")[1];
        video.removeAttribute("loop");
    }

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

    //clicks the nextvideo button after time is up
    function clickNext(time , startTime){
        setTimeout(disableLoop , 3000)
        const finishTime = new Date().getTime();               
        const timeout = time*1000 - (finishTime-startTime) - 30;
        start = setTimeout(clickButton ,timeout)
    }

    //gets the information of video
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

    //gets a message from the background.js
    chrome.runtime.onMessage.addListener((obj , sender, response)=>{
        if(obj.type="New"){
            getvideos(obj.videoId , obj.startTime);
        }
    })
})();