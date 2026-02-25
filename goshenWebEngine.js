class goshenWebEngine {
    config= new pageConfiguration();
    psalm=1;
    headerDiv;
    contentDiv;
    loader;
    async loadHeader(){
        const resp = await fetch(this.config.header);
        const html = await resp.text();
        //this.headerDiv.insertAdjacentHTML("afterbegin", html);
        this.headerDiv.innerHTML = html;
    }
    async loadContent(){
        const resp = await fetch(this.config.content);
        const html = await resp.text();
        //this.contentDiv.insertAdjacentHTML("afterbegin", html);
        this.contentDiv.innerHTML = html;
    }

    checkURLForRedirects() {
        let currentLocation = window.location.href;
        if (currentLocation.includes('com/?psalm')) {
            let parameter = currentLocation.split('/?psalm')[1];
            let psalmNumber = parseInt(parameter);
            if (psalmNumber != NaN) {
                psalm = psalmNumber;
                this.loadPresets('Psalm');
            }

        } else {
            this.loadPresets('Homepage');
        }
    }
    setNavigationConfiguration(){
        if (this.config.page != "homepage"){
            const navigationItem = document.getElementById(this.config.page);
            navigationItem.classList.add("selected");
        }
    }
    loadPresets(page){
        this.headerDiv = document.getElementById("Header");
        this.contentDiv = document.getElementById("Content");
        this.loader = document.getElementById("Loader");
        if (page == 'Homepage') {
            this.loadHeader();
            this.loadContent();
            this.setNavigationConfiguration();
            this.hideLoader();
        }
    }

    async loadPage(pageName){
        await this.config.loadConfig(pageName);
        this.showLoader();
        if (this.config.shouldReloadHeader){
            await this.loadHeader();
            this.config.shouldReloadHeader=false;
        }
        if (this.config.shouldReloadContent){
            console.log(this.config.page);
            await this.loadContent();
            this.config.shouldReloadContent=false;
        }
        this.hideLoader();
    }
    hideLoader() {
        this.loader.classList.add("hidden");
    }

    showLoader() {
        this.loader.classList.remove("hidden");
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
webEngine = new goshenWebEngine();

