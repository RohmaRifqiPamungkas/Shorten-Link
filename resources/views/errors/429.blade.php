@extends('errors.layout')

@section('title', __('Too Many Requests'))
@section('code', '429')
@section('message', __('You have made too many requests in a short time. Please wait and try again.'))
