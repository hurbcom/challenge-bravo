@extends('layouts.app', ['activePage' => 'historico', 'titlePage' => __('Cotações')])

@section('content')
<div class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-primary">
            <h4 class="card-title ">Cotações</h4>
            <p class="card-category"> Exibe todas as importadas</p>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6 text-right">
                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#cotacaoNew" data-whatever="@getbootstrap">Cadastrar Cotação</button>
                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#cotacaoModal" data-whatever="@getbootstrap">Importar Cotação</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead class=" text-primary">
                  <tr>
                    <th>
                      Moeda
                    </th>
                    <th>
                      Vl. Compra
                    </th>
                    <th>
                      Vl. Venda
                    </th>
                    <th>
                      Máx.
                    </th>
                    <th>
                      Mín.
                    </th>
                    <th>
                      Var.
                    </th>
                    <th>
                      Pct. Var.
                    </th>
                    <th>
                      Dt. cotacao
                    </th>
                    <th>
                      Importado
                    </th>
                    <th class="text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                @foreach($cotacao as $row)
                <tr>
                  <!-- $row->code
                  $row->codein
                 
                  $row->high
                  $row->low
                  $row->varBid
                  $row->pctChange
                  $row->bid
                  $row->ask
                  $row->timestamp -->
                  <!-- $row->create_date -->
                  <td>{{$row->code ."-". $row->codein." - ".  $row->name}}</td>
                  <td>{{$row->bid}}</td>
                  <td>{{$row->ask}}</td>
                  <td>{{$row->high}}</td>
                  <td>{{$row->low}}</td>
                  <td>{{$row->varBid}}</td>
                  <td>{{$row->pctChange}}</td>
                  <td>{{ date('d/m/Y H:i:s', strtotime($row->create_date))}}</td>
                  <td>{{ date('d/m/Y H:i:s', strtotime($row->created_at))}}</td>
                  <td class="td-actions text-right">
                    <button rel="tooltip" class="btn btn-sm btn-success btn-edit-cotacao" id="{{$row->id}}">
                      <i class="material-icons">edit</i>
                      <div class="ripple-container"></div>
                    </button>
                    <button class="btn btn-danger btn-sm btn-del-cotacao" id="{{$row->id}}">
                      <i class="material-icons">delete</i>
                      <div class="ripple-container"></div>
                    </button>
                  </td>

                </tr>
                @endforeach

              </table>
            </div>
            <div class="row">
              @if (isset($cotacao) && $cotacao->lastPage() > 1)
              <div class="col-sm-12 col-md-5">
                <div class="dataTables_info" id="datatables_info" role="status" aria-live="polite">
                  <font style="vertical-align: inherit;">
                    <font style="vertical-align: inherit;">Mostrando de {{$cotacao->currentPage()}} a {{$cotacao->count()}} de {{$cotacao->total()}} entradas</font>
                  </font>
                </div>
              </div>
              <div class="col-sm-12 col-md-7">
                <div class="dataTables_paginate paging_full_numbers" id="datatables_paginate">
                  <ul class="pagination">

                    <?php
                    $interval = isset($interval) ? abs(intval($interval)) : 3;
                    $from = $cotacao->currentPage() - $interval;
                    if ($from < 1) {
                      $from = 1;
                    }

                    $to = $cotacao->currentPage() + $interval;
                    if ($to > $cotacao->lastPage()) {
                      $to = $cotacao->lastPage();
                    }
                    ?>

                    <!-- first/previous -->
                    @if($cotacao->currentPage() > 1)
                    <li class="paginate_button page-item first" id="datatables_first">
                      <a href=" {{ $cotacao->url(1) }}" aria-label="First" aria-controls="datatables" data-dt-idx="0" tabindex="0" class="page-link">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">PRIMEIRO</font>
                        </font>
                      </a>
                    </li>

                    <li class="paginate_button page-item previous" id="datatables_previous">
                      <a href="{{ $cotacao->url($cotacao->currentPage() - 1) }}" aria-label="Previous" aria-controls="datatables" data-dt-idx="0" tabindex="0" class="page-link">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">ANTERIOR</font>
                        </font>
                      </a>
                    </li>
                    @endif

                    <!-- links -->
                    @for($i = $from; $i <= $to; $i++) <?php
                                                      $isCurrentPage = $cotacao->currentPage() == $i
                                                      ?> <li class="paginate_button page-item {{ $isCurrentPage ? 'active' : '' }}">
                      <a href="{{ !$isCurrentPage ? $cotacao->url($i) : '#' }}" aria-controls="datatables" data-dt-idx="2" tabindex="0" class="page-link">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">{{$i}}</font>
                        </font>
                      </a>
                      </li>
                      @endfor

                      <!-- next/last -->
                      @if($cotacao->currentPage() < $cotacao->lastPage())
                        <li class="paginate_button page-item next" id="datatables_next">
                          <a href="{{ $cotacao->url($cotacao->currentPage() + 1) }}" aria-label="Next" aria-controls="datatables" data-dt-idx="6" tabindex="0" class="page-link">
                            <font style="vertical-align: inherit;">
                              <font style="vertical-align: inherit;">PRÓXIMO </font>
                            </font>
                          </a>
                        </li>

                        <li class="paginate_button page-item last" id="datatables_last">
                          <a href="{{ $cotacao->url($cotacao->lastpage()) }}" aria-label="Last" aria-controls="datatables" data-dt-idx="7" tabindex="0" class="page-link">
                            <font style="vertical-align: inherit;">
                              <font style="vertical-align: inherit;">ÚLTIMO</font>
                            </font>
                          </a>
                        </li>
                        @endif

                  </ul>
                </div>
              </div>
              @endif

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="cotacaoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Importar cotação</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body">
          <form id="form-import">

            <div class="row">
              <div class="col-md-12">
                <label class="bmd-label-floating"> Moeda Origem</label>

                <select class="form-control" name="from" id="from" required>
                  <option disabled selected>SELECIONE</option>
                  <option value="USD">Dolar - US</option>
                  <option value="BRL">Real - BR</option>
                  <option value="EUR">Euro</option>
                  <option value="BTC">Bitcoin</option>
                  <option value="ETH">Ethereum </option>
                </select>
                <span class="help-block"></span>
              </div>

            </div>

            <div class="row">
              <div class="col-md-12">

                <label class="bmd-label-floating"> Moeda Destino </label>

                <select class="form-control" name="to" id="to" required>
                  <option disabled selected>SELECIONE</option>
                  <option value="USD">Dolar <img src="{{ asset('material') }}/img/flags/US.png"></option>
                  <option value="BRL">Real - BR</option>
                  <option value="EUR">Euro</option>
                  <option value="BTC">Bitcoin</option>
                  <option value="ETH">Ethereum </option>
                </select>
                <span class="help-block"></span>

              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Dias</label>
                  <input type="text" name="num" id="num" class="form-control">
                  <span class="help-block"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                <button type="submit" id="btn-import" class="btn btn-success">Importar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="cotacaoNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Gerenciar cotação</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card-body">
          <form name="form-new" id="form-new">
            <input type="hidden" name="id" id="id">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Name</label>
                  <input type="text" name="name" id="name" class="form-control">
                  <span class="help-block"></span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <div class="form-group bmd-form-group is-focused">
                  <label class="bmd-label-floating"> Moeda Origem </label>
                  <select class="form-control" name="code" id="code" required>
                    <option disabled selected>SELECIONE</option>
                    <option value="USD">Dolar</option>
                    <option value="BRL">Real</option>
                    <option value="EUR">Euro</option>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum </option>
                  </select>
                  <span class="help-block"></span>
                </div>
              </div>
            </div>
            </br></br>
            <div class="row">
              <div class="col-md-12">
                <div class="form-group bmd-form-group is-focused">
                  <label class="bmd-label-floating"> Moeda Destino </label>

                  <select class="form-control" name="codein" id="codein" required>
                    <option disabled selected>SELECIONE</option>
                    <option value="USD">Dolar </option>
                    <option value="BRL">Real</option>
                    <option value="EUR">Euro</option>
                    <option value="BTC">Bitcoin</option>
                    <option value="ETH">Ethereum </option>
                  </select>
                  <span class="help-block"></span>
                </div>
              </div>
            </div>
            </br>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Máximo </label>
                  <input type="number" name="high" id="high" class="form-control money" maxlength="8">
                  <span class="help-block"></span>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Mínimo</label>
                  <input type="number" name="low" id="low" class="form-control money">
                  <span class="help-block"></span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Variação</label>
                  <input type="number" name="varBid" id="varBid" class="form-control money">
                  <span class="help-block"></span>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Porcentagem de Variação</label>
                  <input type="number" name="pctChange" id="pctChange" class="form-control money">
                  <span class="help-block"></span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Compra</label>
                  <input type="number" name="bid" id="bid" class="form-control money">
                  <span class="help-block"></span>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group bmd-form-group">
                  <label class="bmd-label-floating">Venda</label>
                  <input type="number" name="ask" id="ask" class="form-control money">
                  <span class="help-block"></span>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-12">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                <button type="submit" id="btn-salvar" class="btn btn-success">Salvar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

@endsection

@push('js')
<script src="{{ asset('material') }}/js/cotacao.js"></script>
@endpush