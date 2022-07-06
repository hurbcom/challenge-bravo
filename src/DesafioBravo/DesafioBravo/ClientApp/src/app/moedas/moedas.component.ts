import { Component } from '@angular/core';
import { Moeda } from '../model-view/Moeda';
import { MoedasDTO } from '../model-view/MoedasDTO';
import { MoedaService } from '../services/moeda.service';
import { RetornoDTO } from '../model-view/RetornoDTO';
import { finalize } from 'rxjs/operators';
import { MoedaDTO } from '../model-view/MoedaDTO';

@Component({
  selector: 'moedas',
  templateUrl: './moedas.component.html'
})
export class MoedasComponent {
  moeda = new Moeda();
  msg: string;
  retornoListMoedas = new MoedasDTO();
  retornoMoeda = new MoedaDTO();
  moedas: Moeda[] = [];

  constructor(private moedaServer: MoedaService) {
    this.retornoListMoedas.retorno = new RetornoDTO();
    this.getMoedas();
  }

  onSubmit() {
    this.addMoeda();
  }

  getMoedas() {
    this.moedaServer.listar().pipe(finalize(() => { }))
      .subscribe(dados => {

        this.retornoListMoedas = <MoedasDTO>dados;
        this.moedas = dados.moedas;

        console.log(JSON.stringify(this.retornoListMoedas));

        this.msg = "";

        if (this.retornoListMoedas.retorno.sucesso == false) {
          this.msg += this.retornoListMoedas.retorno.mensagem;
          console.log(this.msg);
        }
      }
      );
  }

  addMoeda() {
    this.moedaServer.add(this.moeda).pipe(finalize(() => { }))
      .subscribe(dados => {

        this.retornoMoeda = <MoedaDTO>dados;

        console.log(JSON.stringify(this.retornoListMoedas));

        this.msg = "";

        if (this.retornoListMoedas.retorno.sucesso == false) {
          this.msg += this.retornoListMoedas.retorno.mensagem;
          console.log(this.msg);
        } else {
          this.getMoedas();
        }
      }
      );
  }


  ExcluirMoeda(codigo: string) {
    this.moedaServer.delete(codigo).pipe(finalize(() => { }))
      .subscribe(dados => {

        this.retornoMoeda = <MoedaDTO>dados;

        console.log(JSON.stringify(this.retornoListMoedas));

        this.msg = "";

        if (this.retornoListMoedas.retorno.sucesso == false) {
          this.msg += this.retornoListMoedas.retorno.mensagem;
          console.log(this.msg);
        } else {
          this.getMoedas();
        }
      }
      );
  }
}
