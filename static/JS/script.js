let progressBar = document.getElementById('progress-bar')

progressBar.addEventListener(
    'mousedown', 
    (event) => progressBar.addEventListener("mousemove", timeSlider, event))

progressBar.addEventListener(
    'mouseup', 
    (event) => progressBar.removeEventListener("mousemove", timeSlider, event))

progressBar.addEventListener(
    "mouseleave", 
    (event) => progressBar.removeEventListener("mousemove", timeSlider, event))

progressBar.addEventListener(
    "click",
    (event) => timeSlider(event)
)

function timeSlider(event){
    const duration =  Number(document.getElementById('durationTag').innerHTML)
    const PGBar = event.target.getBoundingClientRect()
    const left = PGBar.x - window.scrollX
    const width = PGBar.width
    const currentTimePosition = event.clientX - left
    const player = document.getElementById('player')
    
    player.currentTime = (duration * currentTimePosition) / width
    setPBTime(currentTimePosition)

    
}

async function setPBTime(timeToSet){
    const PGBar = document.getElementById('progress-bar')
    const currentTimeBar = PGBar.getElementsByClassName('currentTime')[0]
    currentTimeBar.style.width = `${timeToSet}px`
}




async function setSong(result){

  
  const title = result.getElementsByClassName("song-name")[0].innerText
  const channel = result.getElementsByClassName("singer")[0].innerText
  const thumb = result.getElementsByClassName("imgThumb")[0].getAttribute('src')
  const duration = result.getElementsByClassName("song-duration")[0].innerHTML
  
  document.getElementById("headphones").setAttribute('src', `${thumb}`)
  document.getElementById("currentSong").innerText = `Now Playing:  ${title}`
  document.getElementById("durationTag").innerHTML = result.getElementsByClassName('duration')[0].innerHTML
  document.getElementById("singerTag").innerHTML = `Canal ${channel}`

  const ytUrl = result.getElementsByClassName("song-url")[0].innerText
  const origin = document.getElementById('origin')
  origin.setAttribute('href', ytUrl)
  origin.innerHTML = 'Música original'
  const directLinkConst = await directLink(ytUrl)

  const source = document.getElementById("player").setAttribute('src', `${directLinkConst}`)

  const box = document.getElementsByClassName("results")[0]
  $(box).hide()
  setPBTime(0)
}




function formatDuration(duration){
  const correctDuration = duration/60
  return correctDuration
}


async function directLink(videoUrl){
  
  const urlGetLink = "https://api.anglemusic.ga/directLink?"
  const videoUrlConst = `url=${videoUrl}`

  const response = await fetch(urlGetLink+videoUrlConst, {method:'GET'})
  const data = await response.json()

  return data.url
}





function playAudio() {
  if (player.readyState) {
    player.play();
  }
}





function pauseAudio() {
  player.pause();
}





const slider = document.getElementById("volumeSlider");
slider.oninput = function (e) {
  const volume = e.target.value;
  player.volume = volume;
};






function updateProgress() {
    const player = document.getElementById('player')
    const PGbar = document.getElementById('progress-bar')
    const currentTimeBar = PGbar.getElementsByClassName('currentTime')[0].getBoundingClientRect().width
    const duration =  Number(document.getElementById('durationTag').innerHTML)
    const timeToSet = (player.currentTime * PGbar.getBoundingClientRect().width) / duration
    setPBTime(timeToSet)
    setTimer()
    
  
}
function setTimer(){
  const timer = document.getElementById('timer')
  const date = new Date(0)
  const player = document.getElementById('player')
  date.setSeconds(player.currentTime)
  timeToString = date.toISOString().substring(11, 19);
  timer.innerHTML = timeToString

}


async function search(query, maxResults = 10){
  const baseUrl = "https://api.anglemusic.ga/search?"
  const query_const = `q=${query}`
  const maxResults_const = `maxResults=${maxResults}`
  const response = await fetch(baseUrl+query_const+"&"+maxResults_const, {method:'GET'})
  const data = await response.json()
  return data
}





async function addResultsOnBody(title, channel, duration, thumb, url){
  const date = new Date(0)
  date.setSeconds(Number(duration))
  const result = `<div id="result1" class="result" onclick="setSong(this)">
                  <img class="imgThumb" src="${thumb.url}"/>
                  <h3 class="song-name">${title}</h3>
                  <p class="singer">${channel}</p>. 
                  <p class="song-duration">${date.toISOString().substring(11, 19)}</p>
                  <span hidden class="duration">${duration}</span>
                  <span hidden id="song-url" class="song-url">${url}</span>
                  </div>`
                
  document.getElementById("results").innerHTML += result
}





async function searchResults(q){
  document.getElementById("results").innerHTML = "";
  const results = await search(q)

  for (let i = 0; i < results.length; i++){
      await addResultsOnBody(
          results[i].title,
          results[i].channelTitle,
          results[i].duration,
          results[i].thumbnails.high,
          results[i].videoUrl
      )
  }

  const box = document.getElementsByClassName("results")[0]
  $(box).show()
}


const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}