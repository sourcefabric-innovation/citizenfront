'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .controller('SessionCtrl', function ($scope, api, $routeParams, $http, config, session, addNewValues, PagePolling, Body) {
    Body.glue = true;
    $scope.reports = [];
    $scope.replies = {};
    $scope.users = {};
    $scope.$watch('reports', function() {
      // scan the list of reports from the last (most recent) to the first
      for(var i=($scope.reports.length-1); i >= 0; i--) {
        // choose the first report with an author
        if (!($scope.reports[i].local)) {
          $scope.replyReport = $scope.reports[i];
          return;
        }
      }
      // we do not expect to have a session without any report
      // generated by a citizen
      if ($scope.reports.length) {
        throw new Error('no valid report found for replies in session '+$routeParams.session);
      }
    }, true);
    $scope.reset = function() {
      $scope.reply = '';
    };
    $scope.sendReply = function(data) {
      data.user_id = session.identity._id;
      data.sensitive = false;
      data.language = 'en';
      $http
        .post(config.server.url + 'proxy/mobile-reply/', data)
        .then(function() {
          $scope.reset();
          fetch(1);
        });
    };

    function fetch(page) {
      api.reports
        .query({
          where: JSON.stringify({
            'session': $routeParams.session
          }),
          sort:'[("produced", 1)]',
          page: page
        })
        .then(function(response) {
          addNewValues($scope.reports, response._items);
          if (response._links.next) {
            fetch(page + 1);
          }
        });
    }
    fetch(1);
    PagePolling.setInterval(function() { fetch(1); }, 10 * 1000);

    function fetchUsers(page) {
      api.users
        .query({ page: page })
        .then(function(response) {
          response._items.map(function(user) {
            $scope.users[user._id] = user;
          });
          if (response._links.next) {
            fetchUsers(page + 1);
          }
        });
    }
    fetchUsers(1);
    
  });
