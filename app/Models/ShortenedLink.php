<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShortenedLink extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'original_url', 'short_code', 'custom_alias', 'expires_at'];
}