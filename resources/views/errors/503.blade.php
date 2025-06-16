@extends('errors.layout')

@section('title', __('Service Unavailable'))
@section('code', '503')
@section('message', __('The service is temporarily unavailable. Please try again later.'))
