<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'completed',
        'priority',
    ];

    // Relación: una tarea pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}