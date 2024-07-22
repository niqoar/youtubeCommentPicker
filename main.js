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
const snipitsAPI = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=";
const commentsAPI = "https://www.googleapis.com/youtube/v3/commentThreads?";
const API_KEY = 'AIzaSyC2UIxuyuVcI4-tShB6QY6gjN151eM9zPI';
let videoId = '';

// Model
let commentsArray = [];
let nameList = [];

// Choose a winner
document.querySelector("#winnerButton").addEventListener("click", event => {
    hideComment();

    if (nameList.length === 0) {
        alert("¡Ingresa el link del video!");
    } else {
        const spinTimes = 20;
        let i = 0;
        let number = 0;
        let winner = "";

        const myInterval = setInterval(myWinnerDisplay, 70);

        function myWinnerDisplay() {
            i++;
            if (i > spinTimes) {
                clearInterval(myInterval);
                displayComment();
            } else {
                number = Math.floor(Math.random() * nameList.length);
                winner = nameList[number];
                document.querySelector("#winner").innerText = winner;
            }
        }

        function displayComment() {
            const message = commentsArray[number].snippet.topLevelComment.snippet.textDisplay;
            document.querySelector("#winnerCommentLabel").style.display = "block";
            document.querySelector("#winnerComment").innerHTML = message;
        }
    }
});

function hideComment() {
    document.querySelector("#winnerCommentLabel").style.display = "none";
    document.querySelector("#winnerComment").textContent = "";
}

function hideWinner() {
    document.querySelector("#winner").textContent = "";
}

document.querySelector("#reloadButton").addEventListener("click", (event) => {
    document.location.reload();
});

document.querySelector("#sendButton").addEventListener("click", (event) => {
    const inputValue = document.querySelector("#urlInput").value;
    hideWinner();
    hideComment();

    let regex = /v=([^&]+)|be\/([^&]+)/;
    const match = inputValue.match(regex);
    videoId = match[1] || match[2];

    console.log(`match =${match}`);
    console.log(`match length=${match.length}`);
    console.log(`videoID =${videoId}`);

    const URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
    console.log(URL);

    const maxResult = 100;
    const URL2 = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${maxResult}&order=time&videoId=${videoId}&key=${API_KEY}`;
    console.log(URL2);

    getData(URL, URL2);

    async function getData(videoURL, commentsURL, nextPageToken = '') {
        const responseInfo = await fetch(videoURL);
        let finalCommentsURL = commentsURL;
        if (nextPageToken) {
            finalCommentsURL += `&pageToken=${nextPageToken}`;
        }
        const responseComments = await fetch(finalCommentsURL);
        const infoData = await responseInfo.json();
        const commentsData = await responseComments.json();

        const videoTitle = infoData.items[0].snippet.title;
        document.querySelector("#title").innerHTML = videoTitle;

        commentsArray = [...commentsArray, ...commentsData.items];

        if (commentsData.nextPageToken) {
            await getData(videoURL, commentsURL, commentsData.nextPageToken);
        } else {
            nameList = [];
            document.querySelector("#nameList").innerHTML = "";
            document.querySelector("#nameTot").innerText = `Usuarios:`;

            commentsArray.map(item => {
                nameList.push(item.snippet.topLevelComment.snippet.authorDisplayName);
            });
            console.log(`nameList (before deduplication) = ${nameList}`);

            const uniqueNameList = [...new Set(nameList)];
            console.log(`nameList (after deduplication) = ${uniqueNameList}`);

            uniqueNameList.map(name => {
                const sp = document.createElement("span");
                sp.innerText = name;
                sp.classList.add("name-tag", "bg-primary", "text-white");
                document.querySelector("#nameList").appendChild(sp);
            });

            console.log(`nameTot = ${uniqueNameList.length}`);
            document.querySelector("#nameTot").innerText = `Usuarios: ${uniqueNameList.length} en total`;
        }
    }
});

document.getElementById('rainButton').addEventListener('click', function() {
    const container = document.getElementById('emoteContainer');

    for (let i = 0; i < 30; i++) {
        createEmote(container);
    }
});

function createEmote(container) {
    const emote = document.createElement('div');
    emote.classList.add('emote');

    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 3 + 2;

    emote.style.left = `${startX}px`;
    emote.style.animationDuration = `${duration}s`;

    container.appendChild(emote);

    emote.addEventListener('animationend', () => {
        emote.remove();
    });
}
