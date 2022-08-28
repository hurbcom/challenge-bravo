@extends('layouts.app', ['class' => 'off-canvas-sidebar', 'activePage' => 'home', 'title' => __('Bravo Cotações')])

@section('content')
<div class="container" style="height: auto;">
  <div class="row justify-content-center">
    <div class="col-lg-7 col-md-8">
      <div class="card card-login card-hidden mb-3">
        <div class="card-header card-header-primary text-center">
          <p class="card-title"><strong>{{ __('Verifique seu endereço de e-mail') }}</strong></p>
        </div>
        <div class="card-body">
          <p class="card-description text-center"></p>
          <p>
            @if (session('resent'))
          <div class="alert alert-success" role="alert">
            {{ __('Um novo link de verificação foi enviado para seu endereço de e-mail.') }}
          </div>
          @endif

          {{ __('Antes de continuar, verifique seu e-mail para obter um link de verificação.') }}

          @if (Route::has('verification.resend'))
          {{ __('Se você não recebeu o e-mail') }},
          <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
            @csrf
            <button type="submit" class="btn btn-link p-0 m-0 align-baseline">{{ __('clique aqui para solicitar outro') }}</button>.
          </form>
          @endif
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection