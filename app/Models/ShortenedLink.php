<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShortenedLink extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'domain_id',
        'original_url', 
        'short_code', 
        'custom_alias', 
        'expires_at', 
        'password'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    protected $appends = ['full_short_url'];

    public function clicks()
    {
        return $this->hasMany(UrlClick::class);
    }

    public function domain()
    {
        return $this->belongsTo(Domain::class, 'domain_id');
    }

    public function getFullShortUrlAttribute()
    {
        if ($this->domain) {
            $domain = rtrim($this->domain->domain, '/');

            // kalau user nyimpen tanpa http(s), tambahkan default http://
            if (!preg_match('~^https?://~', $domain)) {
                $domain = 'http://' . $domain;
            }
        } else {
            $domain = config('app.url');
        }

        return rtrim($domain, '/') . '/s/' . $this->short_code;
    }
}
