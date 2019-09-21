/*
http://api.giphy.com/v1/gifs/search?q=coding%20train&api_key=dc6zaTOxFJmzC&limit=5
*/
var api = "https://api.giphy.com/v1/";
var apiKey = "&api_key=59tpzgCcHAbMjPRqDAUklk79IyBTdF75";
var playOrPause = "Auto play: ON";
var links = [];

function loadJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(xhr.response, null);
    } else {
      callback(xhr.response, status);
    }
  };
  xhr.send();
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addImage(title, gifImage, gifSmall, gifFull, ratio_WidthHeight) {
  var newImage = document.createElement("IMG");
  newImage.src = playOrPause == "Auto play: ON" ? gifSmall : gifImage;
  newImage.title = title;
  newImage.textContent = links.length;
  if (searchType() == "gifs/search?" || searchType() == "gifs/trending?")
    newImage.style.backgroundColor = getRandomColor();
  else newImage.style.backgroundColor = "transparent";

  var addTo = getMinHeightElement(["images"]);
  document.getElementById(addTo.id).appendChild(newImage);

  links.push({ image: gifImage, small: gifSmall, full: gifFull });
  console.log(links.length);
}

function getMinHeightElement(arr) {
  var min = document.getElementById(arr[0]).offsetHeight;
  var result = arr[0];
  for (var i = 1; i < arr.length; i++) {
    var h = document.getElementById(arr[i]).offsetHeight;
    if (h < min) {
      min = h;
      result = arr[i];
    }
  }
  return { id: result, value: min };
}

function searchType() {
  return document.getElementById("sType").selectedOptions[0].value;
}

function searchGiphy(giphyName) {
  var query = "&q=" + giphyName;
  var limit = "&limit=" + 25;
  var url = api + searchType() + apiKey + limit + query;
  loadJSON(url, function(giphys, status) {
    if (status === null) {
      if (giphys.data.length < 1) {
        window.alert("Dont have data for this giphy name");
      } else {
        deleteImages();
        for (var i = 0; i < giphys.data.length; i++) {
          addImage(
            giphys.data[i].title,
            giphys.data[i].images.fixed_height_still.url,
            giphys.data[i].images.fixed_height_small.url,
            giphys.data[i].images.original.url,
            giphys.data[i].images.fixed_height_small.height /
              giphys.data[i].images.fixed_height_small.width
          );
        }
      }
    }
  });

  if (searchType() == "gifs/search?")
    for (var i = 25; i < window_WidthHeight().height / 20; i++) {
      addRandom(giphyName, "gifs");
    }
}

function addRandom(giphyName, type) {
  var tag = "&tag=" + giphyName;
  var url = api + type + "/random?" + apiKey + tag;
  loadJSON(url, function(giphys, status) {
    if (status === null)
      addImage(
        giphys.data.title,
        giphys.data.images.fixed_height_still.url,
        giphys.data.images.fixed_height_small.url,
        giphys.data.images.original.url,
        giphys.data.images.fixed_height_small.height /
          giphys.data.images.fixed_height_small.width
      );
  });
}

function changeImage() {
  var x = document.getElementById("inputS").value;
  if (
    (x != "" &&
      searchType() != "gifs/trending?" &&
      searchType() != "stickers/trending?") ||
    searchType() == "gifs/trending?" ||
    searchType() == "stickers/trending?"
  )
    searchGiphy(x);
}

function deleteImages() {
  console.clear();
  links = [];
  var imas = document.getElementsByTagName("img");
  for (var i = imas.length - 1; i >= 0; i--) {
    imas[i].parentNode.removeChild(imas[i]);
  }
}

function playPauseImage() {
  playOrPause =
    playOrPause == "Auto play: OFF" ? "Auto play: ON" : "Auto play: OFF";
  var imgs = document.getElementsByTagName("img");
  for (var i = imgs.length - 1; i >= 0; i--) {
    var linksI = links[imgs[i].textContent];
    imgs[i].src = playOrPause == "Auto play: ON" ? linksI.small : linksI.image;
  }
  var but = document.getElementById("playPauseBut");
  but.textContent = playOrPause;
}

function window_WidthHeight() {
  var w =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return { width: w, height: h };
}

function copyToClipboard(str) {
  // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  var selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
}

window.onload = function() {
  var w = window_WidthHeight().width;
  var h = window_WidthHeight().height;

  // add more gifs when scroll
  document.getElementById("imgArea").addEventListener("scroll", e => {
    var ele = e.target;
    if (ele.scrollHeight - ele.scrollTop <= ele.clientHeight + h / 4) {
      var x = document.getElementById("inputS").value;
      if (searchType() == "gifs/search?") addRandom(x, "gifs");
    }
  });

  //event
  document
    .getElementById("inputS")
    .addEventListener("change", e => changeImage());
  document
    .getElementById("sType")
    .addEventListener("change", e => changeImage());
  document
    .getElementById("playPauseBut")
    .addEventListener("click", e => playPauseImage());

  document.getElementById("shareFb").addEventListener("click", e => {
    window.open("https://facebook.com/sharer/sharer.php?u=" + e.target.src);
  });
  document.getElementById("shareTwitter").addEventListener("click", e => {
    window.open("https://twitter.com/intent/tweet?text=" + e.target.src);
  });
  document.getElementById("shareLink").addEventListener("click", e => {
    copyToClipboard(e.target.src);
  });

  //event
  imgArea.addEventListener("mouseover", e => {
    if (e.target.matches("img")) {
      var eles = document.getElementsByTagName("a");
      for (var i = 0; i < eles.length; i++) {
        eles[i].style.top = (e.target.y + 16) + "px";
        eles[i].style.left = e.target.x + 32 * i + "px";
        eles[i].src = links[e.target.textContent].full;
      }

      if (playOrPause == "Auto play: OFF")
        e.target.src = links[e.target.textContent].small;
    }
  });
  imgArea.addEventListener("mouseout", e => {
    if (e.target.matches("img") && playOrPause == "Auto play: OFF") {
      e.target.src = links[e.target.textContent].image;
    }
  });

  imgArea.addEventListener("click", e => {
    if (e.target.matches("img")) {
      window.open(links[e.target.textContent].full);
    }
  });

  //add firt random gif
  console.log("load " + h / 20 + " firt image");
  for (var i = 0; i < h / 20; i++) {
    addRandom("hello", "gifs");
  }
};
