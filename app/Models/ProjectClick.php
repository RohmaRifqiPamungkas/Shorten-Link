<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectClick extends Model
{
    protected $fillable = [
        'project_id',
        'ip_address',
        'user_agent',
        'referer',
        'country',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
