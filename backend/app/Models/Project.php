<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_es',
        'title_en',
        'description_es',
        'description_en',
        'image',
        'url',
    ];
}