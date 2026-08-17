<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;

    /**
     * Nome da tabela associada ao model.
     * (Laravel já inferiria "documentos" automaticamente, mas deixamos explícito.)
     */
    protected $table = 'documentos';

    /**
     * Atributos que podem ser atribuídos em massa (mass assignment).
     */
    protected $fillable = [
        'nome',
        'categoria',
        'descricao',
        'validade',
        'status',
    ];

    /**
     * Conversão automática de tipos.
     */
    protected $casts = [
        'validade' => 'date',
    ];
}
