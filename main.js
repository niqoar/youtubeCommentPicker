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

// Model
// video name list
let commentsArray = []
let nameList = [] 



// 選出贏家！
document.querySelector("#winnerButton").addEventListener("click", event => {

    hideComment()

    if (nameList.length === 0){
        alert("你還沒有輸入影片網址唷！")
    } else {
        const myInterval = setInterval(myWinnerDisplay, 70);
        // set up 
        const spinTimes = 20
        let  i = 0
        let number = 0
        let winner = ""

        // pick winner
        function myWinnerDisplay() {
                        i ++
            if (i > spinTimes){
                clearInterval(myInterval)
                displayComment()
            } else {
                number = Math.floor( Math.random() * nameList.length)
                winner = nameList[number]
                document.querySelector("#winner").innerText = winner
            }
        }
        // display winner's commments
        function displayComment(){
            const message = commentsArray[number].snippet.topLevelComment.snippet.textDisplay

            // show comment
            document.querySelector("#winnerCommentLabel").style.display = "block"
            document.querySelector("#winnerComment").textContent = message
        }
    }
}) 

// hide comment
function hideComment(){
    document.querySelector("#winnerCommentLabel").style.display = "none"
    document.querySelector("#winnerComment").textContent = ""
}

//hide winner 
function hideWinner(){
    document.querySelector("#winner").textContent = ""
}

// reload button
document.querySelector("#reloadButton").addEventListener("click", (event) => {
    document.location.reload();
})



// 尋找留言小夥伴！
//
document.querySelector("#sendButton").addEventListener("click", (event) => {
    // prevent the default form submission behavior and retrieve the value of the URL input field.
    // without preventDefault() you can't get the value in input
    // event.preventDefault()
    // get the input
    const inputValue = document.querySelector("#urlInput").value

    // hide comment & winner
    hideWinner()
    hideComment()

    // get the videoID from the video url
    // 兩種，一個是youtbue網頁，一個是youtube APP
    let regex = /v=([^&]+)|be\/([^&]+)/;
    const match = inputValue.match(regex);
    videoId = match[1] || match[2];

    // match=( whole match,(group1),(group2) )
    // 參考文件：https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/match
    console.log(`match =${match}`)
    console.log(`match lenght=${match.length}`)
    console.log(`videoID =${videoId}`)

    // API for video info
    const URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
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
        commentsArray = await commentsData.items
        
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
            // create a new <span> element
            const sp = document.createElement("span")
            sp.innerText = name
            sp.classList.add("name-tag","bg-primary","text-white")
            document.querySelector("#nameList").appendChild(sp)
        })
    }
})
