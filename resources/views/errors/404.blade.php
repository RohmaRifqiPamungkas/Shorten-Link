{{-- resources/views/errors/404.blade.php --}}
@extends('errors.layout')

@section('title', __('Page Not Found'))
@section('code', '404')
@section('message', __('The page you are looking for might have been removed, had its name changed or is temporarily unavailable.'))
