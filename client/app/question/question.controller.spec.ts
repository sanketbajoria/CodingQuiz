'use strict';

describe('Component: QuestionListComponent', function () {

  // load the controller's module
  beforeEach(module('codingQuizApp'));

  var QuestionListComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    QuestionListComponent = $componentController('QuestionListComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
