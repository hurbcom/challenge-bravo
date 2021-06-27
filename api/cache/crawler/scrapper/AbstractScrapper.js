
class AbstractScrapper{
    constructor(){
    }

    async scrap(instance){ // crawler que entra no site e recupera a div com as informações
        this.page = await instance.newPage();

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
        return this.page.goto(this.url);
    }
}

module.exports = AbstractScrapper;