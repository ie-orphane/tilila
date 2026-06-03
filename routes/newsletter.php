<?php

use App\Http\Controllers\NewsletterSubscriptionController;
use Illuminate\Support\Facades\Route;

Route::get('newsletter', [NewsletterSubscriptionController::class, 'index'])
    ->name('newsletter.index');
Route::get('newsletter/export.csv', [NewsletterSubscriptionController::class, 'exportCsv'])
    ->name('newsletter.export');
Route::post('newsletter/send', [NewsletterSubscriptionController::class, 'send'])
    ->name('newsletter.send');
Route::delete('newsletter/{subscription}', [NewsletterSubscriptionController::class, 'destroy'])
    ->name('newsletter.destroy');
