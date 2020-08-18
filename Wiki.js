const got = require('got');

class Wiki {

    urlTitle = 'http://wiki.ixcsoft.com.br/api.php?action=query&format=json&list=search&srwhat=title&srsearch=';
    urlText = 'http://wiki.ixcsoft.com.br/api.php?action=query&format=json&list=search&srwhat=text&srsearch=';

    constructor(duvida){
        this.duvida = duvida;
        this.data = null;
    }

    async load() {
        try {
            const response = await got(this.urlTitle + encodeURIComponent(this.duvida));
            let resp = JSON.parse(response.body);

            if (resp.query.searchinfo.totalhits > 0) {
                this.data = resp.query.search[0];
            } else {
                await this.segundaTentativa();
            }

        } catch (error) {
            console.log(error);
        }
    }

    async segundaTentativa() {
        try {
            const response = await got(this.urlText + encodeURIComponent(this.duvida));
            let resp = JSON.parse(response.body);

            if (resp.query.searchinfo.totalhits > 0) {
                this.data = resp.query.search[0];
            }

        } catch (error) {
            console.log(error);
        }
    }

    getDescricao() {

        if (!this.data) {
            return 'Infelizmente não encontramos conteúdo sobre a sua dúvida';
        }

        let url = 'http://wiki.ixcsoft.com.br/index.php/' + this.data.title.split(' ').join('_');
        return `Encontramos um artigo em nossa wiki "${this.data.title}" ${url}`;
    }

}
module.exports = Wiki;