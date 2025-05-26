<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'category_id',
        'title',
        'original_url',
        'is_active',
        'parent_id'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
    
    public function children()
    {
        return $this->hasMany(Link::class, 'parent_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}