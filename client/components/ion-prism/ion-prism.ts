'use strict';

angular.module('codingQuizApp')
  .directive('ionPrism', function() {
    return {
      restrict: 'A',
      priority: 'terminal',
      scope: {
        ionPrism: '='
      },
      link: function($scope, $elem, $attrs){
        $scope.$watch('ionPrism', function(){
          $elem.html($scope.ionPrism);
          var a = $elem.find('pre');
          if(a.length>0){
            Prism.highlightElement(a[0]);
          }
        });
      }
    }
  });
