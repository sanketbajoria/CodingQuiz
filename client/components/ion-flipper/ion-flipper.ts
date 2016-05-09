'use strict';

angular.module('codingQuizApp')
  .directive('ionFlipper', function ($ionicGesture, $timeout, qView) {
    return {
      templateUrl: 'components/ion-flipper/ion-flipper.tmpl.html',
      restrict: 'E',
      scope: {
        question: '=',
        style: '=?',
        class: '@',
        gesture: '@',
        editable: '=',
        onFlip: '&',
        onDelete: '&',
        onEdit: '&',
        onClick: '&',
        toggleFavorite: '&'
      },
      controller: function ($scope, $element, $rootScope) {
        if (!$scope.style) {
          if ($scope.class == 'small')
            $scope.style = $scope.frontStyle = $scope.backStyle = {height: '160px'};
        } else {
          $scope.frontStyle = $scope.backStyle = $scope.style;
        }
        $scope.$watch('flipped', function (newVal) {
          if (!$scope.style && $scope.class == 'normal') {
            $scope.style = newVal ? $scope.backStyle : $scope.frontStyle;
          }
        });

        //Emit event
        $scope.emitEvent = function (eventName, $event) {
          $scope.$emit('$ionFlipper:'+ eventName, $scope.question);
          $event.stopPropagation();
        };
      },
      compile: function (element, attrs) {
        //default value
        attrs.gesture = attrs.gesture || 'hold';
        attrs.class = attrs.class || 'normal';

        //return link function
        return function ($scope, $elem, $attrs) {
          //Apply gesture for flipping the card
          $ionicGesture.on($scope.gesture, function (event) {
            $scope.$apply(function () {
              $scope.flipped = !$scope.flipped;
              if($scope.flipped){
                $scope.onFlip({question: $scope.question});
              }
            });
          }, $elem);

          //After render calculate the frontStyle and backStyle
          if (!$scope.style && $scope.class == 'normal') {
            $timeout(function () {
              $scope.frontStyle = {height: $elem[0].querySelector('.front').offsetHeight + 'px'};
              $scope.backStyle = {height: $elem[0].querySelector('.back').offsetHeight + 'px'};
              $scope.style = $scope.flipped ? $scope.backStyle : $scope.frontStyle;
            }, 0);
          }
        }
      }
    };
});
