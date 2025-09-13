<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('frontend');
});


Route::get('/mini-app', function () {
    return redirect('/mini-app/index.html');
});

Route::group(['prefix' => 'api'], function () {
   Route::get('attractions', 'App\Http\Controllers\AttractionController@index');

   // NFT routes
   Route::get('nfts', 'App\Http\Controllers\NFTController@index');
   Route::get('nfts/attraction/{attractionId}', 'App\Http\Controllers\NFTController@getByAttraction');
   Route::get('nfts/rarity/{rarity}', 'App\Http\Controllers\NFTController@getByRarity');
   Route::post('nfts/win/{attractionId}', 'App\Http\Controllers\NFTController@tryWinNft');
   Route::get('nfts/user/{telegramId}', 'App\Http\Controllers\NFTController@getByTelegramId');
});
