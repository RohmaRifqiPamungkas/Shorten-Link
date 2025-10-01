<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'domain_id',
        'project_name',
        'project_slug',
        'is_active',
        'password'
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    protected $appends = ['full_short_url'];

    /**
     * Relasi: Project milik User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: Project punya banyak kategori
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    /**
     * Relasi: Project punya banyak link
     */
    public function links()
    {
        return $this->hasMany(Link::class, 'project_id');
    }

    /**
     * Scope: Menampilkan hanya proyek yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Relasi: Project punya banyak klik (ProjectClick)
     */
    public function clicks()
    {
        return $this->hasMany(ProjectClick::class);
    }

    /**
     * Relasi: Project mungkin punya domain khusus
     */
    public function domain()
    {
        return $this->belongsTo(Domain::class, 'domain_id');
    }

    /**
     * Aksesor: Mendapatkan URL pendek lengkap dengan domain
     */
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

        return rtrim($domain, '/') . '/m/' . $this->project_slug;
    }
}