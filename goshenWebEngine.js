class goshenWebEngine {
    config= new pageConfiguration();
    psalmEngine = new psalmsEngine();
    psalm=1;
    headerDiv;
    contentDiv;
    loader;
    pages = ['beliefs', 'distinctives', 'homepage', 'imnew', 'leadership', 'lordsday', 'maintenance', 'membership', 'music', 'psalms', 'bible'];
    async loadHeader(){
        const resp = await fetch(this.config.header);
        const html = await resp.text();
        this.headerDiv.innerHTML = html;
    }
    async loadContent(){
        const resp = await fetch(this.config.content);
        const html = await resp.text();
        this.contentDiv.innerHTML = html;
    }

    async checkURLForRedirects() {
        this.loadPresets();
        let currentLocation = window.location.href;
        if (currentLocation.includes('?')) {
            let parameter = currentLocation.split('?')[1];
            if (this.pages.includes(parameter)) {
                await this.loadPage(parameter);
                if(parameter == 'psalms') {
                    this.psalmEngine.setFirstLoad(1);
                }
            } else if (parameter.includes('psalms')) {
                let parameter2 = parameter.split('salms')[1];
                let psalmNumber = parseInt(parameter2);
                if (Number.isInteger(psalmNumber)) {
                    await this.loadPage('psalms');
                    if (psalmNumber > 0 && psalmNumber < 150 && this.psalmEngine.PsalmsOptions.includes(psalmNumber)) {
                        this.psalmEngine.setFirstLoad(psalmNumber);
                    } else {
                        this.psalmEngine.setFirstLoad(1);
                    }
                } else {
                    await this.loadPage('psalms');
                    this.psalmEngine.setFirstLoad(1);
                }
            } else {
                this.loadPage('homepage');
            }
        } else {
            this.loadPage('homepage');
        }
    }

    goToLivePage(page) {
        window.location.href='https://www.trinitychurchsouthside.com?' + page;
    }

    setNavigationConfiguration(){
        const navigationItem = document.getElementById(this.config.page);
        navigationItem.classList.add("selected");
    }

    loadPresets(){
        this.headerDiv = document.getElementById("Header");
        this.contentDiv = document.getElementById("Content");
        this.loader = document.getElementById("Loader");
        this.loadHeader();
        this.loadContent();
        this.hideLoader();
    }

    async loadPage(pageName){
        if (this.config.page != pageName) {
            this.showLoader();
            await this.config.loadConfig(pageName);
            if (this.config.shouldReloadHeader){
                await this.loadHeader();
                this.config.shouldReloadHeader=false;
            }
            if (this.config.shouldReloadContent){
                await this.loadContent();
                this.config.shouldReloadContent=false;
            }
            const navigationItem = document.querySelector(".selected");
            if (navigationItem != null) {
                navigationItem.classList.remove("selected");
            }
            this.setNavigationConfiguration();
            this.hideLoader();
        }
    }

    async loadReadingPlan() {
        var today = new Date(Date.now());
        today = today.toLocaleDateString();
        var otResp = await fetch('OT Reading Plan.txt');
        var otPlan = await otResp.text();
        var otPlanArray = otPlan.split(/\r?\n/);
        let otLocation;
        for (let i=0; i<otPlanArray.length; i++) {
            if (otPlanArray[i].split('_')[0] == today) {
                otLocation = otPlanArray[i].split('_')[1]
            }
        }
        var ntResp = await fetch('NT Reading Plan.txt');
        var ntPlan = await ntResp.text();
        var ntPlanArray = ntPlan.split(/\r?\n/);
        let ntLocation;
        for (let i=0; i<ntPlanArray.length; i++) {
            if (ntPlanArray[i].split('_')[0] == today) {
                ntLocation = ntPlanArray[i].split('_')[1]
            }
        }
        if (otLocation != null && ntLocation != null) {
            var webSearch;
            if (otLocation == ntLocation) {
                webSearch = 'https://www.biblegateway.com/passage/?search=' + ntLocation.trim() + '&version=LSB';
            } else {
                webSearch = 'https://www.biblegateway.com/passage/?search=' + otLocation.trim() + ', ' + ntLocation.trim() + '&version=LSB';
            }
            window.open(webSearch, '_self');
        }
    }

    hideLoader() {
        this.loader.classList.add("hidden");
    }

    showLoader() {
        this.loader.classList.remove("hidden");
    }
    scrollTo(id) {
        const element = document.getElementById(id);
        element.scrollIntoView();
    }
}
class pageConfiguration {
    page="homepage";
    header="header.html";
    content="homepage.html";
    shouldReloadHeader=false;
    shouldReloadContent=false;
    pages = ('ImNew');

    async loadConfig(page){
        this.page = page;
        const resp = await fetch("configurations/" + page + ".txt");
        const lines = await resp.text();
        let configArray = lines.split(/\r?\n/);
        let newHeader = configArray[0].substring(configArray[0].indexOf(":")+1);
        let newContent = configArray[1].substring(configArray[1].indexOf(":")+1);
        if (this.header != newHeader){
            this.header = newHeader;
            const headerDiv = document.getElementById("Header");
            headerDiv.innerHTML = '';
            this.shouldReloadHeader=true;
        }
        if (this.content != newContent){
            this.content = newContent;
            const contentDiv = document.getElementById("Content");
            contentDiv.innerHTML = '';
            this.shouldReloadContent = true;
        }
    }
}
const psalmsEngine = class {
    constructor() {
        this.selectedPsalm = 1;
        this.audioPath = `/assets/musicfiles/Psalm*.mp3`;
        this.PsalmsOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,20,21,22,23,24,25,27,37,40,90];
        this.audio = new Audio(`/assets/musicfiles/Psalm${1}.mp3`);
        this.button = null;
    }
    async setFirstLoad(psalm) {
        await this.getPsalmVerses(psalm);
        this.getPsalmSelectOptions(psalm);
        this.audio.addEventListener("ended", function(){
            this.currentTime = 0;
            let playButton = document.getElementById("psalm_player");
            playButton.innerHTML = "Play >";
        });
        this.button = document.getElementById("psalm_player");
        this.audio = new Audio(`/assets/musicfiles/Psalm${psalm}.mp3`);
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

    getPsalmSelectOptions(psalm) {
        for (let i=0; i<this.PsalmsOptions.length; i++) {
            var psalmSelectDiv = document.getElementById("psalm_select");
            console.log(psalmSelectDiv);
            let element = document.createElement("option");
            element.innerHTML = "Psalm " + this.PsalmsOptions[i];
            element.value = this.PsalmsOptions[i];
            element.classList.add("optionBack");
            psalmSelectDiv.appendChild(element);
        }
        psalmSelectDiv.value = psalm;
    }

    goToPsalm() {
        this.audio.pause();
        this.button.innerHTML = "Play >";
        var e = document.getElementById("psalm_select");
        var psalm = e.value;
        this.loadPsalm(psalm);
        this.audio.addEventListener("ended", function(){
            this.currentTime = 0;
            let playButton = document.getElementById("psalm_player");
            playButton.innerHTML = "Play >";
        });
    }
    playPsalm() {
        if (this.button.innerHTML == "Play &gt;") {
            this.audio.play();
            this.button.innerHTML = "Stop";
        } else {
            this.audio.pause();
            this.button.innerHTML = "Play >";
        }
    }
    
    stopPsalm() {
        this.audio.pause();
    }
}
webEngine = new goshenWebEngine();
