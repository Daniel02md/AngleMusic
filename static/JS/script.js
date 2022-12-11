async function setSong(result){
  const title = result.getElementsByClassName("song-name")[0].innerText
  const channel = result.getElementsByClassName("singer")[0].innerText
  const thumb = result.getElementsByClassName("imgThumb")[0].getAttribute('src')
  const duration = result.getElementsByClassName("song-duration")[0].innerHTML

  document.getElementById("headphones").setAttribute('src', `${thumb}`)
  document.getElementById("currentSong").innerText = `Now Playing:  ${title}`;
  document.getElementById("durationTag").innerHTML = duration
  document.getElementById("singerTag").innerHTML = `Canal ${channel}`

  const ytUrl = result.getElementsByClassName("song-url")[0].innerText
  const directLinkConst = await directLink(ytUrl)

  const source = document.getElementById("player").setAttribute('src', `${directLinkConst}`)

  const box = document.getElementsByClassName("results")[0]
  $(box).hide()

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
  if (player.currentTime > 0) {
    const progressBar = document.getElementById("progress");
    progressBar.value = (player.currentTime / player.duration) * 100;
  }
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
  const result = `<div id="result1" class="result" onclick="setSong(this)">
                  <img class="imgThumb" src="${thumb.url}"/>
                  <h3 class="song-name">${title}</h3>
                  <p class="singer">${channel}</p>. 
                  <p class="song-duration">${duration}</p>
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