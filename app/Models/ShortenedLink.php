<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShortenedLink extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 
        'original_url', 
        'short_code', 
        'custom_alias', 
        'expires_at', 
        'password'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function clicks()
    {
        return $this->hasMany(UrlClick::class);
    }

    public function domain()
    {
        return $this->belongsTo(Domain::class, 'domain_id');
    }
}
