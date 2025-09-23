<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UrlClick extends Model
{
    protected $fillable = [
        'shortened_link_id',
        'ip_address',
        'user_agent',
        'referer',
        'country',
    ];

    public function shortenedLink()
    {
        return $this->belongsTo(ShortenedLink::class);
    }
}
