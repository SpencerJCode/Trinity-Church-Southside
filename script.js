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