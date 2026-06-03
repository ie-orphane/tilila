<?php

use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\ExpertApplicationController;
use App\Http\Controllers\Admin\ExpertController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MediaSidebarController;
use App\Http\Controllers\Admin\OpportunityController;
use App\Http\Controllers\Admin\TililabAnalyticsController;
use App\Http\Controllers\Admin\TililabEditionController;
use App\Http\Controllers\Admin\TililabParticipantController;
use App\Http\Controllers\Admin\TililaConnectRequestController;
use App\Http\Controllers\Admin\TililaContestParticipantController;
use App\Http\Controllers\Admin\TililaEditionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::get('expert-applications', [ExpertApplicationController::class, 'index'])->name('expert-applications.index');
    Route::get('expert-applications/{application}', [ExpertApplicationController::class, 'show'])->name('expert-applications.show');
    Route::patch('expert-applications/{application}/review', [ExpertApplicationController::class, 'review'])->name('expert-applications.review');

    Route::get('experts/export.csv', [ExpertController::class, 'exportCsv'])->name('experts.export');
    Route::patch('experts/{expert}/feature', [ExpertController::class, 'feature'])->name('experts.feature');
    Route::post('experts/{expert}/expert-of-month', [ExpertController::class, 'storeExpertOfMonth'])
        ->name('experts.expert-of-month.store');
    Route::patch('expert-of-months/{expertOfMonth}', [ExpertController::class, 'updateExpertOfMonth'])
        ->name('expert-of-months.update');
    Route::delete('expert-of-months/{expertOfMonth}', [ExpertController::class, 'destroyExpertOfMonth'])
        ->name('expert-of-months.destroy');
    Route::get('experts', [ExpertController::class, 'index'])->name('experts.index');
    Route::get('experts/{expert}/edit', [ExpertController::class, 'edit'])->name('experts.edit');
    Route::match(['put', 'patch'], 'experts/{expert}', [ExpertController::class, 'update'])->name('experts.update');

    Route::get('opportunities/export.csv', [OpportunityController::class, 'exportCsv'])->name('opportunities.export');
    Route::resource('opportunities', OpportunityController::class);

    Route::resource('events', EventController::class);

    Route::get('tilila-connect-requests', [TililaConnectRequestController::class, 'index'])
        ->name('tilila-connect-requests.index');

    Route::get('media/export.csv', [MediaController::class, 'exportCsv'])->name('media.export');
    Route::get('media/sidebar/edit', [MediaSidebarController::class, 'edit'])->name('media.sidebar.edit');
    Route::put('media/sidebar', [MediaSidebarController::class, 'update'])->name('media.sidebar.update');
    Route::resource('media', MediaController::class);

    Route::get('tililab/participants/export.csv', [TililabParticipantController::class, 'exportCsv'])->name('tililab.participants.export');
    Route::get('tililab/participants', [TililabParticipantController::class, 'index'])->name('tililab.participants.index');
    Route::get('tililab/participants/{participant}', [TililabParticipantController::class, 'show'])->name('tililab.participants.show');
    Route::delete('tililab/participants/{participant}', [TililabParticipantController::class, 'destroy'])->name('tililab.participants.destroy');

    Route::get('tililab/analytics', [TililabAnalyticsController::class, 'index'])->name('tililab.analytics.index');

    Route::resource('tilila/editions', TililaEditionController::class)
        ->except(['show'])
        ->names('tilila.editions');

    Route::resource('tililab/editions', TililabEditionController::class)
        ->except(['show'])
        ->names('tililab.editions');

    Route::get('tilila/participants/export.csv', [TililaContestParticipantController::class, 'exportCsv'])
        ->name('tilila.participants.export');
    Route::get('tilila/participants', [TililaContestParticipantController::class, 'index'])
        ->name('tilila.participants.index');
    Route::get('tilila/participants/{participant}', [TililaContestParticipantController::class, 'show'])
        ->name('tilila.participants.show');
    Route::delete('tilila/participants/{participant}', [TililaContestParticipantController::class, 'destroy'])
        ->name('tilila.participants.destroy');

    require __DIR__.'/newsletter.php';
});
