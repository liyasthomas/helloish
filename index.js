/*
http://api.giphy.com/v1/gifs/search?q=coding%20train&api_key=dc6zaTOxFJmzC&limit=5
*/
const api = 'https://api.giphy.com/v1/';
const apiKey = '&api_key=59tpzgCcHAbMjPRqDAUklk79IyBTdF75';
let playOrPause = 'Auto play: ON';
let links = [];

function loadJSON (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true)
  xhr.responseType = 'json'
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(xhr.response, null)
    } else {
      callback(xhr.response, status)
    }
  }
  xhr.send()
}

function getRandomColor () {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function addImage (title, gifImage, gifSmall, gifFull, ratio_WidthHeight) {
  const newImage = document.createElement('IMG');
  newImage.src = playOrPause == 'Auto play: ON' ? gifSmall : gifImage
  newImage.title = title
  newImage.textContent = links.length
  newImage.classList.add('img')
  if (searchType() == 'gifs/search?' || searchType() == 'gifs/trending?') { newImage.style.backgroundColor = getRandomColor() } else newImage.style.backgroundColor = 'transparent'

  const addTo = getMinHeightElement(['images']);
  document.getElementById(addTo.id).appendChild(newImage)

  links.push({ image: gifImage, small: gifSmall, full: gifFull })
  console.log(links.length)
}

function getMinHeightElement (arr) {
  let min = document.getElementById(arr[0]).offsetHeight;
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const h = document.getElementById(arr[i]).offsetHeight;
    if (h < min) {
      min = h
      result = arr[i]
    }
  }
  return { id: result, value: min }
}

function searchType () {
  return document.getElementById('sType').selectedOptions[0].value
}

function searchGiphy (giphyName) {
  const query = `&q=${giphyName}`;
  const limit = `&limit=${25}`;
  const url = api + searchType() + apiKey + limit + query;
  loadJSON(url, ({data}, status) => {
    if (status === null) {
      if (data.length < 1) {
        window.alert('Dont have data for this giphy name')
      } else {
        deleteImages()
        for (let i = 0; i < data.length; i++) {
          addImage(
            data[i].title,
            data[i].images.fixed_height_still.url,
            data[i].images.fixed_height_small.url,
            data[i].images.original.url,
            data[i].images.fixed_height_small.height /
              data[i].images.fixed_height_small.width
          )
        }
      }
    }
  })

  if (searchType() == 'gifs/search?') {
    for (let i = 25; i < window_WidthHeight().height / 20; i++) {
      addRandom(giphyName, 'gifs')
    }
  }
}

function addRandom (giphyName, type) {
  const tag = `&tag=${giphyName}`;
  const url = `${api + type}/random?${apiKey}${tag}`;
  loadJSON(url, ({data}, status) => {
    if (status === null) {
      addImage(
        data.title,
        data.images.fixed_height_still.url,
        data.images.fixed_height_small.url,
        data.images.original.url,
        data.images.fixed_height_small.height /
          data.images.fixed_height_small.width
      )
    }
  })
}

function changeImage () {
  const x = document.getElementById('inputS').value;
  if (
    (x != '' &&
      searchType() != 'gifs/trending?' &&
      searchType() != 'stickers/trending?') ||
    searchType() == 'gifs/trending?' ||
    searchType() == 'stickers/trending?'
  ) { searchGiphy(x) }
}

function deleteImages () {
  console.clear()
  links = []
  const imas = document.getElementsByClassName('img');
  for (let i = imas.length - 1; i >= 0; i--) {
    imas[i].parentNode.removeChild(imas[i])
  }
}

function playPauseImage () {
  playOrPause = playOrPause == 'Auto play: OFF' ? 'Auto play: ON' : 'Auto play: OFF'
  const imgs = document.getElementsByClassName('img');
  for (let i = imgs.length - 1; i >= 0; i--) {
    const linksI = links[imgs[i].textContent];
    imgs[i].src = playOrPause == 'Auto play: ON' ? linksI.small : linksI.image
  }
  const but = document.getElementById('playPauseBut');
  but.textContent = playOrPause
}

function window_WidthHeight () {
  const w =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return { width: w, height: h }
}

function copyToClipboard (str) {
  // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  const el = document.createElement('textarea');
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}

window.onload = () => {
  const w = window_WidthHeight().width;
  const h = window_WidthHeight().height;

  // scroll page with up/down arrows of keyboard
  document.body.onkeydown = function(e) {
    let code = e.keyCode;
    let imgArea = document.getElementById('imgArea');

    if (code === 40) {
      imgArea.scrollTo(0, imgArea.scrollTop + 35);
    }
    else if (code === 38) {
      imgArea.scrollTo(0, imgArea.scrollTop - 35);
    }
  }

  // add more gifs when scroll
  document.getElementById('imgArea').addEventListener('scroll', ({target}) => {
    const ele = target;
    if (ele.scrollHeight - ele.scrollTop <= ele.clientHeight + h / 4) {
      const x = document.getElementById('inputS').value;
      if (searchType() == 'gifs/search?') addRandom(x, 'gifs')
    }
  })

  // event
  document
    .getElementById('inputS')
    .addEventListener('change', e => changeImage())
  document
    .getElementById('sType')
    .addEventListener('change', e => changeImage())
  document
    .getElementById('playPauseBut')
    .addEventListener('click', e => playPauseImage())

  document.getElementById('shareFb').addEventListener('click', ({target}) => {
    window.open(`https://facebook.com/sharer/sharer.php?t=Helloish 👻👋 • AWKWARD GIFS OF PEOPLE SAYING HELLO&u=${target.getAttribute('data')}`)
  })
  document.getElementById('shareTwitter').addEventListener('click', ({target}) => {
    window.open(`https://twitter.com/intent/tweet?text=Helloish 👻👋 • AWKWARD GIFS OF PEOPLE SAYING HELLO&url=${target.getAttribute('data')}`)
  })
  if (navigator.share) {
    document.getElementById('shareAll').style.display = "block";
  } else {
    document.getElementById('shareAll').style.display = "none";
  }
  document.getElementById('shareAll').addEventListener('click', ({target}) => {
    if (navigator.share) {
      navigator.share({
          title: `Helloish 👻👋`,
          text: `Helloish 👻👋`,
          url: target.getAttribute('data')
        }).then(() => {})
        .catch(console.error);
    } else {
      console.log("No native share support!")
    }
  })
  document.getElementById('shareLink').addEventListener('click', ({target}) => {
    copyToClipboard(target.getAttribute('data'))
  })

  // event
  imgArea.addEventListener('mouseover', ({target}) => {
    if (target.matches('img')) {
      const eles = document.getElementsByClassName('a');
      let realImagePosition = target.getBoundingClientRect();
      for (let i = 0; i < eles.length; i++) {
        eles[i].style.top = `${realImagePosition.y + 16}px`
        eles[i].style.left = `${realImagePosition.x + 32 * i}px`
        eles[i].setAttribute('data', target.src)
      }

      if (playOrPause == 'Auto play: OFF') { target.src = links[target.textContent].small }
    }
  })
  imgArea.addEventListener('mouseout', ({target}) => {
    if (target.matches('img') && playOrPause == 'Auto play: OFF') {
      target.src = links[target.textContent].image
    }
  })

  imgArea.addEventListener('click', ({target}) => {
    if (target.matches('img')) {
      window.open(links[target.textContent].full)
    }
  })

  // add firt random gif
  for (let i = 0; i < h / 20; i++) {
    addRandom('hello', 'gifs')
  }
}

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]')
if (localStorage.getItem('marcdownTheme') == 'dark') {
	document.documentElement.setAttribute('data-theme', 'dark')
	document.querySelector('meta[name=theme-color]').setAttribute('content', '#282a36')
	toggleSwitch.checked = true
	localStorage.setItem('marcdownTheme', 'dark')
} else {
	document.documentElement.setAttribute('data-theme', 'light')
	document.querySelector('meta[name=theme-color]').setAttribute('content', '#DAE5ED')
	toggleSwitch.checked = false
	localStorage.setItem('marcdownTheme', 'light')
}
const switchTheme = ({
	target
}) => {
	if (target.checked) {
		document.documentElement.setAttribute('data-theme', 'dark')
		document.querySelector('meta[name=theme-color]').setAttribute('content', '#282a36')
		localStorage.setItem('marcdownTheme', 'dark')
	} else {
		document.documentElement.setAttribute('data-theme', 'light')
		document.querySelector('meta[name=theme-color]').setAttribute('content', '#DAE5ED')
		localStorage.setItem('marcdownTheme', 'light')
	}
}
toggleSwitch.addEventListener('change', switchTheme, false)

const modal = document.querySelector('.modal')
const trigger = document.querySelector('.trigger')
const closeButton = document.querySelector('.close-button')
const toggleModal = () => modal.classList.toggle('show-modal')
const windowOnClick = ({
	target
}) => {
	if (target === modal) {
		toggleModal()
	}
}
trigger.addEventListener('click', toggleModal)
closeButton.addEventListener('click', toggleModal)
window.addEventListener('click', windowOnClick)
