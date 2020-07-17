import React, { Component } from "react";

class Conversor extends Component {
  state = {
    moedas: ["USD", "BRL", "EUR", "BTC", "ETH"],
    moedaBase: "BRL",
    valor: "",
    converterPara: "USD",
    resultado: ""
  };

  adicionarMaisMoedas = e => {
    
    const key = e.which || e.keyCode;
    if (key === 13) {
    const joined = this.state.moedas.concat(e.target.value)
    this.setState({ moedas: joined })
    e.target.value = ""
    }
  }

  onChangeSelect = e => {
    this.setState(
      {
        [e.target.name]: e.target.value,
        resultado: null
      },
      this.calculate
    );
  };

  onChangeInput = e => {
    this.setState(
      {
        valor: e.target.value,
        resultado: null
      },
      this.calculate
    );
  };

  calculate = () => {
    const valor = this.state.valor;
    if (valor === isNaN) {
      return;
    } else {
      fetch(`https://min-api.cryptocompare.com/data/price?fsym=${this.state.moedaBase}&tsyms=${this.state.converterPara}`)
        .then(res => res.json())
        .then(data => {
          const resultado = (data[this.state.converterPara] * valor).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          if (data.Response === "Error"){
            alert(data.Message);
            this.setState();
          }else{
          this.setState({
            resultado
          });
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  };

  trocarMoeda = e => {
    const moedaBase = this.state.moedaBase;
    const converterPara = this.state.converterPara;
    e.preventDefault();
    this.setState(
      {
        converterPara: moedaBase,
        moedaBase: converterPara,
        resultado: null
      },
      this.calculate
    );
  };
  render() {
    const { moedas, moedaBase, valor, converterPara, resultado } = this.state;
    return (
      <div className="container my-5">
        <div className="card card-body">
        <h5>Conversor Monetário</h5>
        <br/>
            <div className="row">
              <div className="col-lg-11 align-self-center">
              <input type="text" className="form-control form-control-lg mx-3" onKeyUp={this.adicionarMaisMoedas} placeholder="Para adicionar mais uma moeda, use a tecla enter"/>
              </div>
            </div>
            <div className="row">
            <div className="col-lg-5 align-self-center">
                  <form className="form-inline mb-4">
                    <input type="money" value={valor} onChange={this.onChangeInput} className="form-control form-control-lg mx-3"/>
                    <select name="moedaBase" value={moedaBase} onChange={this.onChangeSelect} className="form-control form-control-lg">
                      {moedas.map(moeda => (
                        <option key={moeda} value={moeda}>
                          {moeda}
                        </option>
                      ))}
                    </select>
                  </form>
                </div>
                  <div className="col-lg-1 align-self-center mb-4">
                  <h1 onClick={this.trocarMoeda} className="trocar">
                    &#8596;
                  </h1>
                </div>
                <div className="col-lg-5 align-self-center">
                  <form className="form-inline mb-4">
                    <input type="money" disabled={true} value={ valor === "" ? "0" : resultado === null ? "Calculando..." : resultado} className="form-control form-control-lg mx-3"/>
                    <select name="converterPara" value={converterPara} onChange={this.onChangeSelect} className="form-control form-control-lg">
                      {moedas.map(moeda => (
                        <option key={moeda} value={moeda}>
                          {moeda}
                        </option>
                      ))}
                    </select>
                  </form>
                  </div>
                </div>
                </div>
        </div>
    );
  }
}

export default Conversor;
