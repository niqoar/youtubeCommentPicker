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
let previousWinners = [];

// Toggle dark mode
const darkModeButton = document.getElementById('darkModeButton');
const darkModeIcon = document.getElementById('darkModeIcon');
darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeIcon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

const soundDuration = 4000;

// Drum roll button
const drumRollButton = document.getElementById('drumRollButton');
drumRollButton.addEventListener('click', () => {
    
    chooseWinner('yes');
});

// Winner button
const winnerButton = document.getElementById('winnerButton');
winnerButton.addEventListener('click', () => {
    chooseWinner();
});

// Choose a winner
function chooseWinner(playAudio) {
    hideComment();

    if (nameList.length === 0) {
        alert("¡Ingresa el link del video!");
    } else {
        const spinDuration = soundDuration;
        const intervalTime = 70;
        var spinTimes = 30;
        let i = 0;
        let number = 0;
        let winner = "";

        if (playAudio == 'yes') {

            spinTimes = Math.floor(spinDuration / intervalTime)
            
            const audio = new Audio('drum_roll_sound.mp3');
            audio.play();
        }
        
        const myInterval = setInterval(myWinnerDisplay, intervalTime);

        function myWinnerDisplay() {
            i++;
            if (i > spinTimes) {
                clearInterval(myInterval);
                displayComment();
            } else {
                do {
                    number = Math.floor(Math.random() * nameList.length);
                    winner = nameList[number];
                } while (previousWinners.includes(winner) && previousWinners.length < nameList.length);
                document.querySelector("#winner").innerText = winner;
            }
        }

        function displayComment() {
            const message = commentsArray[number].snippet.topLevelComment.snippet.textDisplay;
            document.querySelector("#winnerCommentLabel").style.display = "block";
            document.querySelector("#winnerComment").innerHTML = message;
            
            previousWinners.push(winner);
            console.log(`previousWinners = ${previousWinners}`);
        }
    }
}

function hideComment() {
    document.querySelector("#winnerCommentLabel").style.display = "none";
    document.querySelector("#winnerComment").textContent = "";
}

function hideWinner() {
    document.querySelector("#winner").textContent = "";
}

document.querySelector("#sendButton").addEventListener("click", (event) => {
    const inputValue = document.querySelector("#urlInput").value;
    hideWinner();
    hideComment();

    document.getElementById("loadingNameList").style.display = "block";
    document.getElementById("loadingWinner").style.display = "block";
    document.querySelector("#nameList").innerHTML = "";
    document.querySelector("#title").innerHTML = "";

    let regex = /v=([^&]+)|be\/([^&]+)/;
    const match = inputValue.match(regex);

    if (!match || (!match[1] && !match[2])) {
        alert("URL inválida. Ingresá una URL de Youtube válida.");
        document.getElementById("loadingNameList").style.display = "none";
        document.getElementById("loadingWinner").style.display = "none";
        return;
    }

    const videoId = match[1] || match[2];

    console.log(`match =${match}`);
    console.log(`match length=${match.length}`);
    console.log(`videoID =${videoId}`);

    const URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
    const maxResult = 250;
    const URL2 = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=${maxResult}&order=time&videoId=${videoId}&key=${API_KEY}`;

    getData(URL, URL2);

    async function getData(videoURL, commentsURL, nextPageToken = '') {
        try {
            const responseInfo = await fetch(videoURL);
            if (!responseInfo.ok) {
                throw new Error("No se pudo obtener la información del video.");
            }
            const finalCommentsURL = nextPageToken ? `${commentsURL}&pageToken=${nextPageToken}` : commentsURL;
            const responseComments = await fetch(finalCommentsURL);
            if (!responseComments.ok) {
                throw new Error("No se pudieron obtener los comentarios.");
            }
            const infoData = await responseInfo.json();
            const commentsData = await responseComments.json();

            if (!infoData.items || !infoData.items.length) {
                throw new Error("No se encontró información del vídeo.");
            }

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

                document.getElementById("loadingNameList").style.display = "none";
                document.getElementById("loadingWinner").style.display = "none";
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error(error);
            document.getElementById("loadingNameList").style.display = "none";
            document.getElementById("loadingWinner").style.display = "none";
        }
    }
});
