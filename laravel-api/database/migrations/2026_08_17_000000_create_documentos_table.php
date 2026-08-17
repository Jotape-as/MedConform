<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa a migration (cria a tabela).
     */
    public function up(): void
    {
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('categoria');
            $table->text('descricao')->nullable();
            $table->date('validade')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverte a migration (remove a tabela).
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
