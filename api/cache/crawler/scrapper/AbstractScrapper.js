
class AbstractScrapper{
    constructor(){
    }

    async scrap(instance){ // crawler que entra no site e recupera a div com as informações
        this.page = await instance.newPage();

        await this.page.setRequestInterception(true);

        this.page.on('request', (request) => {
            if (request.resourceType() === 'image') request.abort()
            if (request.resourceType() === 'stylesheet') request.abort()
            if (request.resourceType() === 'font') request.abort()
            if (request.resourceType() === 'imageset') request.abort()
            if (request.resourceType() === 'media') request.abort()
            if (request.resourceType() === 'sub_frame') request.abort()
            if (request.resourceType() === 'csp_report') request.abort()
            if (request.resourceType() === 'main_frame') request.abort()
            else request.continue()
        })

        await this.goToPage();
    }

    async getCurrency(id){
        return this.page.$$eval(id, (elements) => { // usd -> brl
            if(elements.length > 0){
                return elements[0].textContent;
            }
        });
    }

    processInformation(info){
        return parseFloat(info.replace('\n', '')
        .replace('.', '')
        .replace(',', '.').trim());
    }

    async goToPage(browserInstance){
        return this.page.goto(this.url, {  waitUntil: 'domcontentloaded' });
    }
}

module.exports = AbstractScrapper;