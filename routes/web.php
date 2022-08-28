<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Awesame\ApiController;
use App\Http\Controllers\Awesame\HistoricoCotacaoController;


Route::get('/', function () {
	return view('welcome');
});

Route::post('/login', 'App\Http\Controllers\AuthController@login');
// Route::post('/logout', 'App\Http\Controllers\AuthController@logout');


Auth::routes();


Route::group(['middleware' => 'auth:sanctum'], function () {

	Route::resource('user', 'App\Http\Controllers\UserController', ['except' => ['show']]);
	Route::get('profile', ['as' => 'profile.edit', 'uses' => 'App\Http\Controllers\ProfileController@edit']);
	Route::put('profile', ['as' => 'profile.update', 'uses' => 'App\Http\Controllers\ProfileController@update']);
	Route::put('profile/password', ['as' => 'profile.password', 'uses' => 'App\Http\Controllers\ProfileController@password']);


	// Route::get('/cotacao', 'App\Http\Controllers\Awesame\CotacaoController@index')->name('cotacao');
	// Route::post('/cotacao', 'App\Http\Controllers\Awesame\CotacaoController@index')->name('app.admin.cotacao');
	// Route::get('/cotacao/minhas-cotacoes', 'App\Http\Controllers\Awesame\HistoricoCotacaoController@index')->name('app.historico.cotacoes');

	Route::post('/converte', 'App\Http\Controllers\Awesame\CotacaoController@store')->name('app.converte');

	/** Grupo Cotação */
	Route::group(['prefix' => 'cotacao'], function () {


		Route::get('/historico/{id}', [HistoricoCotacaoController::class, 'show']);
		Route::get('/historico', [HistoricoCotacaoController::class, 'index'])->name('cotacao/historico');
		Route::post('/historico', [HistoricoCotacaoController::class, 'store']);
		Route::post('/historico/save', [HistoricoCotacaoController::class, 'saveCotacao']);
		Route::put('/historico/save/{id}', [HistoricoCotacaoController::class, 'updateCotacao']);
		Route::delete('/historico/{id}', [HistoricoCotacaoController::class, 'destroy']);
		Route::put('/historico/{id}', [HistoricoCotacaoController::class, 'update']);

		/** Cotação Ex: USD para BRL, USD para BTC, ETH para BRL, etc... */
		Route::post('/lastcoin', [HistoricoCotacaoController::class, 'lastcoin']);

		// daily / USD - BRL / 15
		Route::get('/daily', 'App\Http\Controllers\Awesame\ApiController@daily');
	});
});

Route::get('/home', 'App\Http\Controllers\HomeController@index')->name('home')->middleware('auth:sanctum');

//Se remover layout quebra
Route::group(['middleware' => 'auth:sanctum'], function () {
	Route::get('table-list', function () {
		return view('pages.table_list');
	})->name('table');

	Route::get('typography', function () {
		return view('pages.typography');
	})->name('typography');

	Route::get('icons', function () {
		return view('pages.icons');
	})->name('icons');

	Route::get('map', function () {
		return view('pages.map');
	})->name('map');

	Route::get('notifications', function () {
		return view('pages.notifications');
	})->name('notifications');

	Route::get('rtl-support', function () {
		return view('pages.language');
	})->name('language');

	Route::get('upgrade', function () {
		return view('pages.upgrade');
	})->name('upgrade');
});
