const psalmsEngine = class {
    constructor() {
        this.selectedPsalm = 1;
        this.audioPath = `/assets/musicfiles/Psalm*.mp3`;
        this.numberOfPsalms = 1;
        this.audio = new Audio(`/assets/musicfiles/Psalm${1}.mp3`);
    }
    setFirstLoad() {
        this.getPsalmVerses(1);
        this.getPsalmSelectOptions();
    }

    getPsalmVerses(psalmNumber) {
        let file = "/assets/psalmTextFiles/psalm" + psalmNumber + ".txt";
        fetch(file).then((res) => res.text()).then((text) => {
            let textArray = text.split('\n');
            var versesDiv = document.getElementById("psalm_verses");
            versesDiv.replaceChildren();
            document.getElementById("psalm_title").innerHTML = textArray[0];
            document.getElementById("psalm_tune").innerHTML = textArray[1];
            document.getElementById("psalm_example").innerHTML = textArray[2];
            for(var i=3; i<textArray.length; i++){
                if (textArray[i].length > 6){
                    let element = document.createElement("span");
                    element.innerHTML = textArray[i];
                    versesDiv.appendChild(element);
                } else {
                    let element = document.createElement("br");
                    versesDiv.appendChild(element);
                }
            }
        })
        .catch((e) => console.error(e));
        this.audio = new Audio(`/assets/musicfiles/Psalm${this.selectedPsalm}.mp3`);
    }

    loadPsalm(psalmNumber) {
        this.selectedPsalm = psalmNumber;
        this.getPsalmVerses(this.selectedPsalm);
    }

    getPsalmSelectOptions() {
        for (let i=1; i<this.numberOfPsalms+1; i++) {
            var psalmSelectDiv = document.getElementById("psalm_select");
            let element = document.createElement("option");
            element.innerHTML = "Psalm " + i;
            element.value=i;
            element.classList.add("optionBack");
            psalmSelectDiv.appendChild(element);
        }
    }
};