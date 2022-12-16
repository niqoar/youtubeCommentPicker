/* API KEY
How to Get a YouTube API Key
Log in to Google Developers Console.
Create a new project.
On the new project dashboard, click Explore & Enable APIs.
In the library, navigate to YouTube Data API v3 under YouTube APIs.
Enable the API.
Create a credential.
A screen will appear with the API key.
*/

// videoID
// example: https://www.youtube.com/watch?v=aojsUEPIhZQ&t=6215s&ab_channel=CharluluStory
// id comes after the "v=": aojsUEIhZQ

//Youtube API HOW TO: //
//https://developers.google.com/youtube/v3/code_samples/code_snippets//


// Youtube API
const snipitsAPI= "https://www.googleapis.com/youtube/v3/videos?part=snippet&id="
const commentsAPI = "https://www.googleapis.com/youtube/v3/commentThreads?"
const API_KEY = 'AIzaSyC2UIxuyuVcI4-tShB6QY6gjN151eM9zPI';
let videoId = '';

// video name list
let nameList = [] 



// 選出贏家！
document.querySelector("#winnerButton").addEventListener("click", event => {
    if (nameList.length === 0){
        alert("你還沒有輸入影片網址唷！")
    } else {
        const number = Math.floor( Math.random() * nameList.length)
        const winner = nameList[number]
        document.querySelector("#winner").innerText = winner
    }
})


// 尋找留言小夥伴！
document.querySelector("#sendButton").addEventListener("click", (event) => {
    // prevent the default form submission behavior and retrieve the value of the URL input field.
    // without preventDefault() you can't get the value in input
    // event.preventDefault()
    // get the input
    const inputValue = document.querySelector("#urlInput").value

    // get the videoID from the video url
    const regex = /v=([^&]+)/
    const match = inputValue.match(regex)
    videoId = match[1]
    // API for video info
    const URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
    console.log(videoId)
    console.log(URL)

    // API for comment
    const maxResult = 100
    const URL2 = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${maxResult}&order=time&videoId=${videoId}&key=${API_KEY}`
    console.log(URL2)

    getData()

        // in a asyn function, we can use the await method
        async function getData() {
        //await: fetch API response 
        const responseInfo = await fetch(URL);
        const responseComments = await fetch(URL2)
        //await: conver response's promist to a json object call data
        const infoData = await responseInfo.json();
        const commentsData = await responseComments.json();

        // get video's channel title
        const videoTitle = infoData.items[0].snippet.title;
        
        // display channel title
        document.querySelector("#title").innerHTML = videoTitle

        // get commentor object
        let commentsArray = await commentsData.items
        
        // reset name list
        nameList = []
        // reset name list disply
        document.querySelector("#nameList").innerHTML = ""
        
        // get comentor's names
        commentsArray.map(item => { 
            nameList.push(item.snippet.topLevelComment.snippet.authorDisplayName)
        })
        console.log(`nameList = ${nameList}`)

        // display commentor's names
        nameList.map(name => {
            const sp = document.createElement("span")
            sp.innerText = name
            sp.classList.add("name-tag","bg-primary","text-white")
            document.querySelector("#nameList").appendChild(sp)
        })
    }
})
