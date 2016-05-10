'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('codingQuizApp')
  .directive('formValidation', function() {
    return {
      restrict: 'A',
      require: '^form',
      link: function(scope, element, attrs, ngForm) {
        var validators = scope.$eval(attrs.formValidation);
        Object.keys(validators).forEach(key => {
          scope.$watch(validators[key], newValue => {
            ngForm.$setValidity(key, newValue);
          });
        });
      }
    };
  });
