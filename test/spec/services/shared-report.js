'use strict';

describe('Service: SharedReport', function () {

  // load the service's module
  beforeEach(module('citizendeskFrontendApp'));

  // instantiate service
  var SharedReport,
      api,
      $rootScope;
  beforeEach(inject(function (_SharedReport_, _api_, _$rootScope_) {
    SharedReport = _SharedReport_;
    api = _api_;
    spyOn(api.reports, 'getById').andCallThrough();
    $rootScope = _$rootScope_;
  }));

  it('should do something', function () {
    expect(!!SharedReport).toBe(true);
  });
  describe('upon a first request', function() {
    var shared;
    beforeEach(function() {
      shared = SharedReport.get('abc');
    });
    it('asks for the corresponding report', function() {
      expect(api.reports.getById).toHaveBeenCalledWith('abc');
    });
    it('satisfies an early request when the moment comes', function() {
      var report;
      shared.property.onValue(function(_report_) { report = _report_; });
      api.reports.def.getById.resolve('response');
      $rootScope.$digest();
      expect(report).toBe('response');
    });
    describe('on the second request', function() {
      beforeEach(function() {
        api.reports.reset.getById();
        spyOn(api.reports, 'getById').andCallThrough();
        SharedReport.get('abc');
      });
      it('does not requires the report again', function() {
        expect(api.reports.getById).not.toHaveBeenCalled();
      });
    });
  });
});
