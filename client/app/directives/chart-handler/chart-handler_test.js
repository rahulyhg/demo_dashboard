'use strict';

describe('myApp.directives module', function() {

  beforeEach(function(){
    module('myApp');
  });

  describe('chartDirectiveCtrl', function(){

    var $scope,
        chartDirectiveCtrl,
        existingChart,
        drilldownChart,
        chartPoints,
        chartEvent;

    beforeEach(inject(function($injector){
      var $rootScope = $injector.get('$rootScope'),
          $controller = $injector.get('$controller');
          
      $scope = $rootScope.$new();

      //Create our drilldown chart (for ease of use)
      drilldownChart = {
        title: 'My Title',
        data: [[1,2,3,4]],
        labels: ['One', 'Two', 'Three', 'Four'],
        hasDrilldown: true
      };

      //Create our existing chart (for ease of use)
      existingChart = {
        data: [[4,3,2,1]],
        labels: ['Four', 'Three', 'Two', 'One'],
        title: 'My Drill'
      };

      //Click event on chart
      chartPoints = [
        {
          label: 'USA'
        }
      ];

      chartEvent = {};

      //Assign our chart as "drilldown" by default
      $scope.title = drilldownChart.title;
      $scope.data = drilldownChart.data;
      $scope.labels = drilldownChart.labels;
      $scope.hasDrilldown = drilldownChart.hasDrilldown;
      $scope.previousChart = existingChart;

      //We're referencing a parent function here
      //TODO: Potentially refactor logic between both controllers
      $scope.click = jasmine.createSpy('clickSpy').and.callFake(function(){
        $scope.hasDrilldown = false;
      });

      //Initialize dashboard controller 
      chartDirectiveCtrl = $controller('chartDirectiveCtrl',{
        $scope: $scope
      });
    }));

    it('should be defined', function() {
      expect(chartDirectiveCtrl).toBeDefined();
    });

    it('should call click with valid point', function(){
      expect($scope.drilldown).toBeDefined();
      expect($scope.click).toBeDefined();

      //Drilldown checks to make sure we're valid before sending it to
      //the service
      $scope.drilldown(chartPoints, chartEvent);
      $scope.$digest();
      expect($scope.click).toHaveBeenCalledWith(chartPoints, chartEvent);
      expect($scope.hasDrilldown).toEqual(false);
    });

    it('should restore our chart to previous', function(){
      $scope.restorePrevious();
      $scope.$digest();

      //Make sure everything flipped accordingly
      expect($scope.title).toEqual(existingChart.title);
      expect($scope.data).toEqual(existingChart.data);
      expect($scope.labels).toEqual(existingChart.labels);
      expect($scope.previousChart).toEqual(false);
      expect($scope.hasDrilldown).toEqual(true);
    });

    it('returns true when we have previous chart false otherwise', function(){
      expect($scope.hasPreviousChart).toBeDefined();
      //We have a previous chart declared in beforeEach
      expect($scope.hasPreviousChart()).toEqual(true);
      $scope.previousChart = false;
      expect($scope.hasPreviousChart()).toEqual(false);
    });
  });
});