'use strict';
/* jshint camelcase: false */

angular.module('citizendeskFrontendApp')
  .service('TwitterSearches', function($resource, $q, Raven, $http, api, lodash, addNewValues, AliasesInLists, Report, config, reportStatuses, session, allPages) {

    var service = this,
        _ = lodash;

    this.list = [];
    this.promise = api.twt_searches
      .query({
        where: JSON.stringify({
          creator: session.identity._id
        })
      })
      .then(function(response) {
        service.list = response._items;
        return service.list;
      });
    /* restart a search and get the contents, or just return the
    contents if they are already there */
    this.start = function(queue) {
      if ('reports' in queue) {
        return $q.when(queue);
      } else {
        queue.reports = [];
        queue.limit   = 50;
        return $http
          .post(config.server.url + 'proxy/start-twitter-search/', {
            user_id: '1',
            request_id: queue._id,
            search_spec: {
              query: queue.query
            }
          })
          .then(function() {
            return service.fetchResults(queue);
          });
      }
    };
    /*
     create the search, get the id from the database, use it in order
     to trigger an actual search action
     */
    this.create = function(terms) {
      return api.twt_searches
        .create({
          description: terms,
          query: {
            contains: [terms]
          },
          creator: session.identity._id
        })
        .then(function(queue) {
          service.list.push(queue);
          return queue._id;
        });
    };
    /* returns the queue in a promise after the first page is fetched,
    keep updating the queue in the closure with the other pages */
    this.fetchResults = function(queue) {
      var query = JSON.stringify({
        $and: [
          {'channels.request': queue._id},
          {status: reportStatuses('')},
          {assignments: {$size: 0}}
        ]
      });
      return allPages(function(page) {
        return api.reports
          .query({
            where: query,
            sort:'[("produced", -1)]',
            page: page
          })
          .then(function(response) {
            addNewValues(queue.reports, response._items);
            queue.reports.forEach(AliasesInLists.embedAuthorAlias);
            return response;
          });
      })
        .then(function() {
          return queue;
        });
    };
    this.byId = function(id) {
      return service.promise
        .then(function(searches) {
          var found = false;
          for (var i=0; i<searches.length; i++) {
            if (typeof id === 'undefined' || searches[i]._id === id) {
              found = searches[i];
            }
          }
          if (found) {
            return service.start(found);
          } else {
            Raven.raven
              .captureMessage('twitter search with id ' + id + ' not found');
          }
        });
    };
    this.delete = function(queue) {
      var promise = api.twt_searches.remove(queue);
      promise.then(function() {
        _.remove(service.list, queue);
      });
      return promise;
    };
    this.refreshReport = function(queueId, reportId) {
      return service
        .byId(queueId)
        .then(function(queue){
          return api.reports
            .getById(reportId, { embedded: '{"assignments.user_id": true }'})
            .then(function(freshReport) {
              var i = _.findIndex(queue.reports, function(candidate) {
                return candidate._id === reportId;
              });
              Report.linkTweetTexts(freshReport);
              queue.reports[i] = freshReport;
              return {
                index: i,
                fresh: freshReport
              };
            });
        });
    };
  });
