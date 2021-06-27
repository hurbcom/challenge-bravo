<?php

namespace App\Models;

use App\Models\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;

class Moeda extends Model
{
    use UuidTrait;

    protected $primaryKey = 'uid';
    protected $keyType = 'string';
    public $incrementing = false;
    public $fillable = [
        'nome',
        'nome_exibicao',
        'lastro',
    ];

    /**
     * para utilizar o nome da moeda como slug
     */
    public function getRouteKeyName()
    {
        return 'nome';
    }

    /**
     * Usando o mutators do lumen para salvar o nome da moeda em maiúscula
     */
    public function setNomeAttribute($nome)
    {
        $this->attributes['nome'] = strtoupper($nome);
    }

    /**
     * Usando o mutators do lumen para salvar o lastro da moeda em maiúscula
     */
    public function setLastroAttribute($lastro)
    {
        $this->attributes['lastro'] = strtoupper($lastro);
    }
}
