import { Component } from '@angular/core';
import { Cotacao } from '../model-view/Cotacao';
import { CotacaoService } from '../services/cotacao.service';
import { finalize } from 'rxjs/operators';
import { CotacaoDTO, CotacaoRetorno } from '../model-view/CotacaoDTO';
import { RetornoDTO } from '../model-view/RetornoDTO';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  cotacao = new Cotacao();
  msg: string;
  retorno = new CotacaoDTO();

  constructor(private cotacaoServer: CotacaoService) {
    this.retorno.cotacao = new CotacaoRetorno();
    this.retorno.retorno = new RetornoDTO();
  }

  onSubmit() {
    this.getCotacao();
  }

  getCotacao() {

    this.cotacaoServer.getCotacao(this.cotacao).pipe(finalize(() => { }))
      .subscribe(dados => {

        this.retorno = <CotacaoDTO>dados;

        //console.log(JSON.stringify(this.retorno));

        this.msg = "";

        if (this.retorno.retorno.sucesso == false) {
          this.msg += this.retorno.retorno.mensagem;
        }
      }
      );
  }
}
