'use strict';

describe('myApp.dashboard module', function() {

  beforeEach(function(){
    module('myApp');
  });

  describe('dashboardCtrl', function(){

    var $scope,
        $httpBackend,
        dashboardCtrl,
        companyService,
        companyRequestHandler,
        fundingRequestHandler,
        chartPoints,
        chartEvent,
        chartDrillData;

    beforeEach(inject(function($injector, _companyService_){
      var $rootScope = $injector.get('$rootScope'),
          $controller = $injector.get('$controller'),
          $q = $injector.get('$q');
          
      $httpBackend = $injector.get('$httpBackend');

      companyService = _companyService_;

      //Click event on chart
      chartPoints = [
        {
          label: 'USA'
        }
      ];

      chartEvent = {};

      chartDrillData = {
        data: {
          chartTitle: 'Drill',
          chartData: [1,2],
          chartLabels: ['one', 'two']
        }
      }

      //These handlers are used to mock failed requests
      companyRequestHandler = $httpBackend.when('GET', '../../api/companies')
                              .respond(200, []);
      fundingRequestHandler = $httpBackend.when('GET', '../../companies/funding/yearly')
                              .respond(200, []);

      //Create our scope
      $scope = $rootScope.$new();

      //Initialize dashboard controller 
      dashboardCtrl = $controller('dashboardCtrl',{
        $scope: $scope,
        companyService: companyService
      });
    }));

    describe('initialization', function(){
      it('should be defined', function() {
        expect(dashboardCtrl).toBeDefined();
      });

      it('called our company service for the top 10', function(){
        $httpBackend.expectGET('../../api/companies');
        //TODO: More robust data integrity checks
      });

      it('called our company service for the funding average', function(){
        $httpBackend.expectGET('../../api/companies/funding/yearly');
        //TODO: More robust data integrity checks
      });
    });
  });
});