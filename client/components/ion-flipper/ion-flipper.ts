'use strict';

angular.module('codingQuizApp')
  .directive('ionFlipper', function($ionicGesture) {
    return {
      templateUrl: 'components/ion-flipper/ion-flipper.tmpl.html',
      restrict: 'E',
      scope: {
        question: '=',
        style: '=',
        gesture: '@',
        read: '=',
        itemClicked: '&onClick'
      },
      controller: function($scope){
        $scope.emitEvent = function ($event) {
          $scope.$emit('$ionFlipper:Clicked', $scope.question);
          $event.stopPropagation();
        }
      },
      compile: function(element, attrs){
        attrs.gesture = attrs.gesture || 'hold';
        return function($scope, $elem, $attrs) {
          $ionicGesture.on($scope.gesture, function (event) {
            $scope.$apply(function () {
              $elem.toggleClass('flip');
            });
          }, $elem);
        }
      }
    };
  });
