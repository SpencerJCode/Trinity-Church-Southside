class webEngine {
    config= new pageConfiguration();
    psalm=1;
    async loadHeader(){
        const resp = await fetch(this.config.header);
        const html = await resp.text();
        const headerDiv = document.getElementById("Header");
        headerDiv.insertAdjacentHTML("afterbegin", html);
    }
    async loadNavigation(){
        const resp = await fetch(this.config.navigation);
        const html = await resp.text();
        const navigationDiv = document.getElementById("Navigation");
        navigationDiv.insertAdjacentHTML("afterbegin", html); 
    }
    async loadContent(){
        const resp = await fetch(this.config.content);
        const html = await resp.text();
        const contentDiv = document.getElementById("Content");
        contentDiv.insertAdjacentHTML("afterbegin", html); 
    }
    async loadFooter(){
        const resp = await fetch(this.config.footer);
        const html = await resp.text();
        const footerDiv = document.getElementById("Footer");
        footerDiv.insertAdjacentHTML("afterbegin", html); 
    }
    setNavigationConfiguration(){
        if (this.config.page != "homepage"){
            const navigationItem = document.getElementById(this.config.page);
            navigationItem.classList.add("selected");
        }
    }
    loadPresets(){
        this.loadHeader();
        this.loadNavigation();
        this.loadContent();
        this.loadFooter();
        this.setNavigationConfiguration();
    }
    loadPage(pageName){
        this.config.loadConfig(pageName);
        if (this.config.shouldReloadHeader){
            this.loadHeader();
            this.config.shouldReloadHeader=false;
        }
        if (this.config.shouldReloadNavigation){
            this.loadNavigation();
            this.config.shouldReloadNavigation=false;
        }    
        if (this.config.shouldReloadContent){
            this.loadContent();
            this.config.shouldReloadContent=false;
        }        
        if (this.config.shouldReloadFooter){
            this.loadFooter();
            this.config.shouldReloadFooter=false;
        }
    }
}
class pageConfiguration {
    page="homepage";
    header="header.html";
    navigation="mainNavigation.html";
    content="homepage.html";
    footer="footer.html";
    shouldReloadHeader=false;
    shouldReloadNavigation=false;
    shouldReloadContent=false;
    shouldReloadFooter=false
    async loadConfig(page){
        const resp = await fetch("configurations/" + page + ".txt");
        const lines = await resp.text();
        let configArray = lines.split(/\r?\n/);
        let newHeader = configArray[0].substring(configArray[0].indexOf(":")+1);
        let newNavigation = configArray[1].substring(configArray[1].indexOf(":")+1);
        let newContent = configArray[2].substring(configArray[2].indexOf(":")+1);
        let newFooter = configArray[3].substring(configArray[3].indexOf(":")+1);
        if (this.header != newHeader){
            this.header = newHeader;
            const headerDiv = document.getElementById("Header");
            headerDiv.innerHTML = '';
            this.shouldReloadHeader=true;
        }
        if (this.navigation != newNavigation){
            this.navigation = newNavigation;
            const navigationDiv = document.getElementById("Navigation");
            navigationDiv.innerHTML = '';
            this.shouldReloadNavigation=true;
        }
        if (this.content != newContent){
            this.content = newContent;
            const contentDiv = document.getElementById("Content");
            contentDiv.innerHTML = '';
            this.shouldReloadContent = true;
        }
        if (this.footer != newFooter){
            this.footer = newFooter;
            const footerDiv = document.getElementById("Footer");
            footerDiv.innerHTML = '';
            this.shouldReloadFooter=false;
        }
    }
}
engine = new webEngine();
