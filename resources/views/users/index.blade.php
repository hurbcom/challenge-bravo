@extends('layouts.app', ['activePage' => 'user', 'titlePage' => __('Meu Perfil')])

@section('content')
<div class="content">
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-primary">
            <h4 class="card-title ">Usuários</h4>
            <p class="card-category"> Todos os usuários cadastrados </p>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12 text-right">
                <a href="#" class="btn btn-sm btn-primary">Add usuário</a>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead class=" text-primary">
                  <tr>
                    <th>
                      Nome
                    </th>
                    <th>
                      Email
                    </th>
                    <th>
                      Criado em
                    </th>
                    <th class="text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>

                  @foreach($users as $user)
                  <tr>
                    <td>{{$user->name}}</td>
                    <td>{{$user->email}}</td>
                    <td>{{ date('d/m/Y H:i:s', strtotime($user->created_at))}}</td>
                    <td class="td-actions text-right">
                      <a rel="tooltip" class="btn btn-success btn-link" href="#" data-original-title="" title="">
                        <i class="material-icons">edit</i>
                        <div class="ripple-container"></div>
                      </a>
                      <a rel="tooltip" class="btn btn-danger btn-link" href="#" data-original-title="" title="">
                        <i class="material-icons">delete</i>
                        <div class="ripple-container"></div>
                      </a>
                    </td>

                  </tr>
                  @endforeach

                </tbody>
              </table>
            </div>
            <div class="row">
              @if (isset($users) && $users->lastPage() > 1)
              <div class="col-sm-12 col-md-5">
                <div class="dataTables_info" id="datatables_info" role="status" aria-live="polite">
                  <font style="vertical-align: inherit;">
                    <font style="vertical-align: inherit;">Mostrando de {{$users->currentPage()}} a {{$users->count()}} de {{$users->total()}} entradas</font>
                  </font>
                </div>
              </div>
              <div class="col-sm-12 col-md-7">
                <div class="dataTables_paginate paging_full_numbers" id="datatables_paginate">
                  <ul class="pagination">

                    <?php
                    $interval = isset($interval) ? abs(intval($interval)) : 3;
                    $from = $users->currentPage() - $interval;
                    if ($from < 1) {
                      $from = 1;
                    }

                    $to = $users->currentPage() + $interval;
                    if ($to > $users->lastPage()) {
                      $to = $users->lastPage();
                    }
                    ?>

                    <!-- first/previous -->
                    @if($users->currentPage() > 1)
                    <li class="paginate_button page-item first" id="datatables_first">
                      <a href=" {{ $users->url(1) }}" aria-label="First" aria-controls="datatables" data-dt-idx="0" tabindex="0" class="page-link">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">PRIMEIRO</font>
                        </font>
                      </a>
                    </li>

                    <li class="paginate_button page-item previous" id="datatables_previous">
                      <a href="{{ $users->url($users->currentPage() - 1) }}" aria-label="Previous" aria-controls="datatables" data-dt-idx="0" tabindex="0" class="page-link">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">ANTERIOR</font>
                        </font>
                      </a>
                    </li>
                    @endif

                    <!-- links -->
                    @for($i = $from; $i <= $to; $i++) <?php
                                                      $isCurrentPage = $users->currentPage() == $i
                                                      ?> <li class="paginate_button page-item {{ $isCurrentPage ? 'active' : '' }}">
                      <a href="{{ !$isCurrentPage ? $users->url($i) : '#' }}" aria-controls="datatables" data-dt-idx="2" tabindex="0" class="page-link">
                        <font style="vertical-align: inherit;">
                          <font style="vertical-align: inherit;">{{$i}}</font>
                        </font>
                      </a>
                      </li>
                      @endfor

                      <!-- next/last -->
                      @if($users->currentPage() < $users->lastPage())
                        <li class="paginate_button page-item next" id="datatables_next">
                          <a href="{{ $users->url($users->currentPage() + 1) }}" aria-label="Next" aria-controls="datatables" data-dt-idx="6" tabindex="0" class="page-link">
                            <font style="vertical-align: inherit;">
                              <font style="vertical-align: inherit;">PRÓXIMO </font>
                            </font>
                          </a>
                        </li>

                        <li class="paginate_button page-item last" id="datatables_last">
                          <a href="{{ $users->url($users->lastpage()) }}" aria-label="Last" aria-controls="datatables" data-dt-idx="7" tabindex="0" class="page-link">
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
  @endsection