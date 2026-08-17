<?php

use App\Http\Controllers\Api\DocumentoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rotas do recurso "documentos". Todas já recebem o prefixo /api
| automaticamente por estarem neste arquivo (routes/api.php).
|
*/

Route::get('/documentos', [DocumentoController::class, 'index']);       // GET    /api/documentos
Route::get('/documentos/{id}', [DocumentoController::class, 'show']);   // GET    /api/documentos/{id}
Route::post('/documentos', [DocumentoController::class, 'store']);      // POST   /api/documentos
Route::put('/documentos/{id}', [DocumentoController::class, 'update']); // PUT    /api/documentos/{id}
Route::patch('/documentos/{id}', [DocumentoController::class, 'update']); // PATCH /api/documentos/{id}
Route::delete('/documentos/{id}', [DocumentoController::class, 'destroy']); // DELETE /api/documentos/{id}

// Alternativa equivalente, usando apenas uma linha (comentada para referência):
// Route::apiResource('documentos', DocumentoController::class);
