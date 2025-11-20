let currentsong = new Audio()
let time = 0
let songArrs = []
let cname = []
let index = 0
let currentInterval
let Volume = document.querySelector('#volume')
let currentVolume
Volume.addEventListener('change', (e) => {
    currentsong.volume = parseInt(e.target.value) / 100
    currentVolume = e.target.value
});
function change() {
    let a = document.querySelector('.change')
    a.classList.contains('fa-play')
        ? a.classList.replace('fa-play', 'fa-pause')
        : a.classList.replace('fa-pause', 'fa-play');
    a.classList.contains('fa-play')
        ? currentsong.pause()
        : currentsong.play()
    a.classList.contains('fa-play')
        ? clearInterval(currentInterval)
        : tim()

}
function ss() {
    document.querySelector('.time').style.visibility = "visible";
}
function mute() {
    let a = document.querySelector('.volume');
    a.classList.contains('fa-volume-high')
        ? a.classList.replace('fa-volume-high', 'fa-volume-xmark')
        : a.classList.replace('fa-volume-xmark', 'fa-volume-high');
    a.classList.contains('fa-volume-high')
        ? document.querySelector('.rng').value = currentVolume
        : document.querySelector('.rng').value = 0
    a.classList.contains('fa-volume-high')
        ? currentsong.volume = parseInt(document.querySelector('.rng').value) / 100
        : currentsong.volume = 0
}
function ic() {
    document.querySelector('.lists').classList.replace('lists', 'lis')
    document.querySelector(".li").style.display = "none";
    document.querySelector(".list").style.display = "none";
    let tcs = document.querySelector('.time')
    if (window.innerWidth < 700) {
        tcs.style.bottom = '70px';
    } else {
        tcs.style.bottom = '0';
    }
}
document.querySelector('.name').addEventListener('click', () => {
    if (window.innerWidth < 500) {
        cl()
    }
})
document.querySelector('.gmi').addEventListener('click', () => {
    cl()
})
function cl() {
    document.querySelector('.lists') || document.querySelector('.lis').classList.replace('lis', 'lists')
    document.querySelector(".li").style.display = "block";
    document.querySelector(".list").style.display = "block";
    let im = document.querySelector('.time')
    if (im.style.visibility === "hidden") {
        im.style.visibility = "hidden";
    } else {
        im.style.visibility = "visible";
    }
    im.style.bottom = "0"
}
function v() {
    document.querySelector('.time').style.visibility = " visible"
}
// // Js for Songs__________________________________________________________________________________________________
async function displayAlbum() {
    let response = await fetch('/Songs')
    let data = await response.text();
    let div = document.createElement('div');
    div.innerHTML = data

    let albumArray = Array.from(div.querySelectorAll('a'));
    albumArray.splice(0, 1);
    let folderNames = []

    albumArray.forEach(a => {
        let folderarray = a.href.replaceAll('/', ' ').trim().split(' ');
        folderNames.push(folderarray[folderarray.length - 1])
        // console.log(folderNames)
    })
    folderNames.splice(0, 2)

    for (const folder of folderNames) {
        // console.log(folder)

        let response = await fetch(`/Songs/${folder}`);
        let data = await response.text();
        let div = document.createElement('div');
        div.innerHTML = data;
        // console.log(data)

        let folderas = Array.from(div.querySelectorAll('a'));
        // console.log(folderas);

        let section = document.createElement('section');
        let headingAlbum = document.createElement('h1');
        let response1 = await fetch(`/Songs/${folder}/info.json`);
        // console.log(response,response1);

        let data1 = await response1.json();
        // console.log(data1);

        headingAlbum.textContent = data1.title;
        section.appendChild(headingAlbum);
        let playlists_container = document.createElement('div')
        playlists_container.classList.add('line')

        for (const playlist of folderas) {
            if (playlist.href !== 'http://127.0.0.1:5501/' && playlist.href !== `http://127.0.0.1:5501/Songs/${folder}` && playlist.href !== `http://127.0.0.1:5501/Songs` && !(playlist.href.includes('/info.json'))) {

                let playlistfolder = playlist.href.split('Songs/')[1]
                let response2 = await fetch(`${playlist.href}/info.json`)
                let data2 = await response2.json()
                // console.log(data2,response2);

                playlists_container.innerHTML += `
                <div class="song" data-folder="${playlistfolder}" >
                    <img src="${playlist.href}/cover.jpeg" alt=""  onclick="cl()" >
                    <p class="sn">${data2.title}</p>
                    <p class="icon">
                        <i class="fa-solid fa-play fa-lg" style="color: #000000;"></i>
                    </p>
                </div>`
            }
        }
        section.appendChild(playlists_container)
        document.querySelector('.lis').appendChild(section)
    }
}
function timeFromate(time) {
    let minuts = String(Math.floor((time % 3600) / 60)).padStart(2, '0')
    let sec = String(Math.floor(time % 60)).padStart(2, '0')
    return `${minuts}:${sec}`
}
function updatecurrenttime(time) {
    if (time <= Math.floor(currentsong.duration)) {
        document.querySelector('.currenttime').textContent = `${timeFromate(time)}`
        let currentpercent = `${Math.floor((time / currentsong.duration) * 100)}`
        document.querySelector('#seekbar').value = currentpercent
        console.log(currentpercent);
    }
    else {
        clearInterval(currentInterval)
    }
}
function tim() {
    currentInterval = setInterval(() => {
        time++;
        updatecurrenttime(time)
    }, 1000)
}
function playSong(songName) {
    clearInterval(currentInterval);
    time = 0;
    currentsong.src = songName;
    currentsong.addEventListener('loadedmetadata', () => {
        document.querySelector('.timeduration').textContent = timeFromate(currentsong.duration);
        document.querySelector('.currenttime').textContent = `00:00`;
        document.querySelector('.change').classList.replace('fa-play', 'fa-pause');
        currentsong.play();
    });
    tim()

    currentsong.addEventListener('ended', () => {
        index++;
        if (index < songArrs.length) {
            document.querySelector('.name').textContent = cname[index];
            playSong(songArrs[index]);
        }
    });
}
function findSongClick() {
    let plays = document.querySelectorAll('.play1')
    console.log(plays);

    plays.forEach((play, indexx) => {
        play.addEventListener('click', () => {

            let requestFolder = play.getAttribute('data-folder')
            let songName = play.querySelector('.songName').textContent.replaceAll(' ', '%20')
            document.querySelector('.name').textContent = play.querySelector('.songName').textContent
            index = indexx
            console.log('clicked song index is ', indexx)

            // playSong(`Songs/${requestFolder}/${songName}`)
            playSong(songArrs[indexx])
        })
    })
}
async function displaySidebar() {

    let playlists = document.querySelectorAll('.song');
    let sidebar = document.querySelector('.over')
    // console.log(playlists);

    playlists.forEach(playlist => {
        playlist.addEventListener('click', async () => {
            sidebar.innerHTML = ''
            let requestFolder = playlist.getAttribute('data-folder');
            // console.log(requestFolder);

            let response = await fetch(`Songs/${requestFolder}`)
            let data = await response.text();
            let div = document.createElement('div');
            div.innerHTML = data;
            let songPath = div.querySelectorAll('a');
            let songArr = Array.from(songPath);
            songArr.splice(0, 5);
            // console.log(songArr.length);    

            for (const song of songArr) {
                if (song.href !== `http://127.0.0.1:5501/Songs/${requestFolder}/cover.jpeg` && song.href !== `http://127.0.0.1:5501/Songs/${requestFolder}/info.json`) {
                    // console.log(song.href);

                    let songrfarr = song.href.split('/')
                    songArrs.push(song.href)
                    let songname = songrfarr[songrfarr.length - 1].replaceAll('%20', ' ')
                    cname.push(songname)
                    // console.log(songname);

                    sidebar.innerHTML += `
                      <div class="play1" onclick="ss()" data-folder = "${requestFolder}">
                        <img style="border-radius: 15px; opacity: 90%;" src="img/musicpro.jpeg" alt="">
                        <p class="songName pn">${songname}</p>
                    </div>`
                }
            }
            findSongClick()
        })
    })
}
async function main() {
    await displayAlbum();
    displaySidebar()

    document.querySelector('#seekbar').addEventListener('change', (e) => {
        let percent = parseInt(e.target.value)
        currentsong.currentTime = (Math.floor(currentsong.duration) * percent) / 100
        time = (Math.floor(currentsong.duration) * percent) / 100
    })

    let currentname = document.querySelector('.name')
    document.querySelector('.privous').addEventListener('click', () => {
        if (index > 0) {
            index--
            currentname.textContent = cname[index]
            playSong(songArrs[index])
        }
    })
    document.querySelector('.next').addEventListener('click', () => {
        if (index > 0) {
            index++
            currentname.textContent = cname[index]
            playSong(songArrs[index])
        }
    })
}
main();
//__________________________________________________________________________________________________________________
window.onload = function () {
    document.querySelector('.b').classList.add('iw');
    document.querySelector('.iw').classList.replace('iw', 'wi');
    document.querySelector('.srch').style.display = "none"
    document.querySelector('.lib').style.display = "none"
    document.querySelector('.time').style.visibility = " hidden"
};
document.querySelector('.g').addEventListener('click', () => {
    document.querySelector('.w').classList.remove('wi')
    document.querySelector('.ig').classList.remove('iw')
})
function sech() {
    document.querySelector('.main').style.display = "none"
    document.querySelector('.srch').style.visibility = "visible"
    document.querySelector('.get').style.visibility = "hidden"
    document.querySelector('.srch').style.display = "block"
    document.querySelector('.lib').style.display = "none"
}
function getapp() {
    document.querySelector('.main').style.display = "none"
    document.querySelector('.get').style.visibility = "visible"
    document.querySelector('.srch').style.visibility = "hidden"
    document.querySelector('.lib').style.display = "none"
}
function eco() {
    document.querySelector('.get').style.visibility = "hidden"
    document.querySelector('.main').style.display = "block"
    document.querySelector('.srch').style.visibility = "hidden"
    document.querySelector('.lib').style.display = "none"
}
function library() {
    document.querySelector('.get').style.visibility = "hidden"
    document.querySelector('.srch').style.visibility = "hidden"
    document.querySelector('.main').style.display = "none"
    document.querySelector('.lib').style.display = "block"
}
function taps() {
    const audio = new Audio(`Songs/India'sBest/playlistB1/Moosetape Intro - Sidhu Moose Wala - Sidhu Moose Wala.mp3`);
    audio.play()
    audio.addEventListener('loadedmetadata', () => {
        document.querySelector('.snv').style.visibility = "hidden"
        document.querySelector('.moosa').style.display = "none"
        setTimeout(() => {
            document.querySelector('.lib').style.display = "none"
            document.querySelector('.snv').style.visibility = "visible"
            document.querySelector('.main').style.display = "block"
        }, audio.duration * 850)
    })
}
