<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Documento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DocumentoController extends Controller
{
    /**
     * GET /api/documentos
     * Lista todos os documentos cadastrados.
     */
    public function index(): JsonResponse
    {
        $documentos = Documento::all();

        return response()->json($documentos, 200);
    }

    /**
     * POST /api/documentos
     * Cria um novo documento.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = $this->validarDados($request);

        if ($validator->fails()) {
            return response()->json([
                'erro' => 'Dados inválidos.',
                'detalhes' => $validator->errors(),
            ], 422);
        }

        $documento = Documento::create($validator->validated());

        return response()->json([
            'mensagem' => 'Documento cadastrado com sucesso!',
            'documento' => $documento,
        ], 201);
    }

    /**
     * GET /api/documentos/{id}
     * Busca um único documento pelo ID.
     */
    public function show(string $id): JsonResponse
    {
        $documento = Documento::find($id);

        if (!$documento) {
            return response()->json([
                'erro' => 'Documento não encontrado.',
            ], 404);
        }

        return response()->json($documento, 200);
    }

    /**
     * PUT/PATCH /api/documentos/{id}
     * Atualiza um documento existente.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $documento = Documento::find($id);

        if (!$documento) {
            return response()->json([
                'erro' => 'Documento não encontrado.',
            ], 404);
        }

        $validator = $this->validarDados($request, atualizando: true);

        if ($validator->fails()) {
            return response()->json([
                'erro' => 'Dados inválidos.',
                'detalhes' => $validator->errors(),
            ], 422);
        }

        $documento->update($validator->validated());

        return response()->json([
            'mensagem' => 'Documento atualizado com sucesso!',
            'documento' => $documento,
        ], 200);
    }

    /**
     * DELETE /api/documentos/{id}
     * Remove um documento pelo ID.
     */
    public function destroy(string $id): JsonResponse
    {
        $documento = Documento::find($id);

        if (!$documento) {
            return response()->json([
                'erro' => 'Documento não encontrado.',
            ], 404);
        }

        $documento->delete();

        return response()->json(null, 204);
    }

    /**
     * Regras de validação compartilhadas entre store() e update().
     */
    private function validarDados(Request $request, bool $atualizando = false): \Illuminate\Contracts\Validation\Validator
    {
        $regra = $atualizando ? 'sometimes' : 'required';

        return Validator::make($request->all(), [
            'nome'      => "{$regra}|string|max:255",
            'categoria' => "{$regra}|string|max:255",
            'descricao' => 'nullable|string',
            'validade'  => 'nullable|date',
            'status'    => "{$regra}|string|max:50",
        ]);
    }
}
