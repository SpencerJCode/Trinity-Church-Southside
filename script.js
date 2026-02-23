function goToPsalm() {
    var e = document.getElementById("psalm_select");
    var psalm = e.value;
    window.location.replace(`/music/psalms/${psalm}.html`);
}

function playPsalm() {
    var button = document.getElementById("player");
    var audio;
    if (button.innerHTML == "PLAY") {
        var e = document.getElementById("psalm_title");
        e = e.innerHTML;
        var psalmNumber = e.substring(6,e.length);
        console.log(psalmNumber);
        audio = new Audio(`/assets/musicfiles/Psalm${psalmNumber}.mp3`);
        audio.play();
        button.innerHTML = "STOP"
    } else {
        location.reload();
    }
}

function setPsalmSelect(){
    var e = document.getElementById("psalm_select");
    var currentPsalm = window.location.pathname.toString();
    var theDot = currentPsalm.indexOf(".");
    currentPsalm = currentPsalm.substring(14,theDot);
    e.value = `${currentPsalm}`;
}

function checkURLForRedirects() {
    console.log("Checking for parameters");
    let currentLocation = window.location.href;
    console.log(currentLocation);
    if (currentLocation.includes('com/?psalm')) {
        let parameter = currentLocation.split('/')[1];
        console.log(parameter);
        console.log(parameter.substring(5, parameter.length));
        let psalmNumber = parseInt(parameter.substring(5, parameter.length));
        console.log("Loading Psalm " + psalmNumber);
    }
}