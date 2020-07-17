
class ExchangeRates
{
	constructor(btc,brl,eth,eur)
	{
		this.btc = btc;
		this.brl = brl;
		this.eth = eth;
		this.eur = eur;
		this.referenceDate = new Date();
	}
}
module.exports = ExchangeRates;