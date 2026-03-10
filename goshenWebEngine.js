class goshenWebEngine {
    config= new pageConfiguration();
    psalm=1;
    headerDiv;
    contentDiv;
    loader;
    pages = ['beliefs', 'distinctives', 'homepage', 'imnew', 'leadership', 'lordsday', 'maintenance', 'membership', 'music', 'psalmbook'];
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
                this.loadPage(parameter);
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
            await this.config.loadConfig(pageName);
            this.showLoader();
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
webEngine = new goshenWebEngine();
