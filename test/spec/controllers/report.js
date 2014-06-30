'use strict';

describe('Controller: ReportCtrl', function () {

  // load the controller's module
  beforeEach(module('citizendeskFrontendApp'));

  var ReportCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    ReportCtrl = $controller('ReportCtrl', {
      $scope: scope,
      $routeParams: {id: 'abcdef'}
    });
    $httpBackend = _$httpBackend_;
    $httpBackend
      .expectGET(globals.root)
      .respond(mocks.root);
    $httpBackend
      .expectGET(globals.root + 'reports/abcdef')
      .respond(angular.copy(mocks.reports['538df48f9c616729ad000035']));
    $httpBackend
      .expectGET(globals.root + 'steps')
      .respond(mocks.steps.list);
    $httpBackend.flush();
  }));

  it('has the correct link to the endpoint', function() {
    expect(scope.report._links.self.href).toBe('http://cd2.sourcefabric.net/citizendesk-interface/reports/538df48f9c616729ad000035');
  });
  it('attaches a report to the scope', function () {
    expect(scope.report).toBeDefined();
  });
  it('disables report verification', function() {
    scope.$apply();
    expect(scope.wait).toBe(true);
  });
  describe('after all steps are done', function() {
    beforeEach(function() {
      scope.report.steps.forEach(function(step) {
        step.done = true;
      });
      scope.$apply();
    });
    it('enables report verification', function() {
      expect(scope.wait).toBe(false);
    });
  });
  describe('starting with existent steps', function() {
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      ReportCtrl = $controller('ReportCtrl', {
        $routeParams: {id: 'abcdef'},
        $scope: scope
      });
      $httpBackend
        .expectGET(globals.root + 'reports/abcdef')
        .respond(mocks.reports['538df48f9c616729ad000035']);
      $httpBackend
        .expectGET(globals.root + 'steps')
        .respond(mocks.steps.list);
      $httpBackend.flush();
    }));
    it('disables report verification', function() {
      scope.$apply();
      expect(scope.wait).toBe(true);
    });
    describe('after all steps are done', function() {
      beforeEach(function() {
        scope.report.steps.forEach(function(step) {
          step.done = true;
        });
        scope.$apply();
      });
      it('enables report verification', function() {
        expect(scope.wait).toBe(false);
      });
    });
  });
  describe('when starting a transcript', function() {
    beforeEach(function() {
      scope.startTranscript();
    });
    it('enables the buttons', function() {
      expect(scope.disableTranscript).toBeFalsy();
    });
    it('has a transcript candidate', function() {
      expect(scope.transcriptCandidate).toBeTruthy();
    });
    it('is editing a transcript', function() {
      expect(scope.editingTranscript).toBe(true);
    });
    it('copies the original content', function() {
      expect(scope.transcriptCandidate).toBe('Russia. Ukraine. Venezuela .........., now France?!!!!! #fight Fascism #fightdiscrimination #fightlynchmobmentality http://instagram.com/p/ov7X-2GEQX/');
    });
    describe('when discarding', function() {
      beforeEach(function() {
        scope.cancelTranscriptEditing();
      });
      it('is not editing a transcript', function() {
        expect(scope.editingTranscript).toBe(false);
      });
    });
    describe('when saving', function() {
      beforeEach(function() {
        scope.transcriptCandidate = 'edited';
        var response = angular.copy(scope.report);
        response.texts[0].transcript = 'edited';
        $httpBackend
          .expect('PATCH', 'http://cd2.sourcefabric.net/citizendesk-interface/reports/538df48f9c616729ad000035')
          .respond(response);
        scope.saveTranscript();
        scope.$digest();
      });
      it('disables the input', function() {
        expect(scope.disableTranscript).toBe(true);
      });
      describe('when saved', function() {
        beforeEach(function() {
          $httpBackend.flush();
        });
        it('updates the model', function() {
          expect(scope.report.texts[0].transcript).toBe('edited');
        });
        it('enables the buttons', function() {
          expect(scope.disableTranscript).toBe(false);
        });
        it('has a transcript', function() {
          expect(scope.hasTranscript).toBeTruthy();
        });
        it('is not editing a transcript', function() {
          expect(scope.editingTranscript).toBe(false);
        });
        afterEach(function() {
          $httpBackend.verifyNoOutstandingRequest();
          $httpBackend.verifyNoOutstandingExpectation();
        });
      });
    });
  });
});
