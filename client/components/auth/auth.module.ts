'use strict';

angular.module('codingQuizApp.auth', [
  'codingQuizApp.constants',
  'codingQuizApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
