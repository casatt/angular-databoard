/**
 * @ngdoc service
 * @name app.server
 * @description
 * The service that handles all the HTTP communication (XHR).
 * As we are dealing with mock-data here, it will not send any requests but create mock-data using chance.js.
 * @see http://chancejs.com/
 *
 * @requires $q
 * @requires $log
 * @requires $timeout
 * @requires chance
 * @requires datagroups
 * @requires datastages
 * */


angular.module('app')
    .factory('server', function ($q, $log, $timeout, chance, datagroups, datastages) {

        var module = {};


        /**
         * @method createEmployees
         * @param {Number} amount
         * @returns {Array}
         */
        function createEmployees(amount) {

            var teams = datagroups,
                locations = datastages,
                titles = ['Senior', 'Junior', 'Trainee', 'Manager'];

            // Let's create X random employees
            return _.times(amount, function () {

                return {
                    id: chance.hash({length: 16}),
                    gender: chance.gender(),
                    firstname: chance.first({gender: this.gender}),
                    lastname: chance.last(),
                    age: chance.age(),
                    email: chance.email(),
                    title: titles[titles.length * Math.random() | 0],
                    phone: chance.phone(),
                    location: locations[locations.length * Math.random() | 0],
                    team: teams[teams.length * Math.random() | 0]
                }

            })

        }

        /**
         * @method fetch
         * @returns {Promise}
         */
        module.fetch = function (route) {
            var deferred = $q.defer();

            $log.log('server::fetch(', route, ')');

            if (!route) {
                deferred.reject('No route passed');
            }
            else {
                // Mocking here as we have no real http service defined
                switch (route.toLowerCase()) {
                    case 'datasets' :
                        return $timeout(function () {
                            return createEmployees(50);
                        }, 10 + Math.random() * 1000);

                        break;
                    default :
                        deferred.reject('Unknown route passed');
                        break;
                }

            }
            return deferred.promise;
        };


        /**
         * @method update
         * @param {String} route
         * @param {Object} data
         * @returns {Promise}
         */
        module.update = function (route, data) {
            var deferred = $q.defer();

            $log.log('server::update(', route, ':', data, ')');

            if (!route) {
                deferred.reject('No route passed');
            }
            else {
                // Mocking here as we have no real http service defined
                switch (route.toLowerCase()) {
                    case 'datasets' :
                        return $timeout(angular.noop, 100 + Math.random() * 1000)
                            .then(function () {
                                return data;
                            });
                        break;
                    default :
                        deferred.reject('Unknown route passed');
                        break;
                }

            }
            return deferred.promise;
        };


        /**
         * @method create
         * @param {String} route
         * @param {Object} data
         */
        module.create = function (route, data) {

            var deferred = $q.defer();

            $log.log('server::create(', route, ':', data, ')');

            if (!route) {
                deferred.reject('No route passed');
            }
            if (!data) {
                deferred.reject('No data passed');
            }
            else {
                // If no id is passed, generate one
                // Normally this would/could be done by a RESTful server api via
                // a post request, but this will do for the demo
                if (!data.id) {
                    data.id = chance.hash({length: 16});
                }

                // Mocking here as we have no real http service defined
                switch (route.toLowerCase()) {
                    case 'datasets' :
                        return $timeout(angular.noop, 100 + Math.random() * 1000)
                            .then(function () {
                                return data;
                            });
                        break;
                    default :
                        deferred.reject('Unknown route passed');
                        break;
                }

            }
            return deferred.promise;
        };

        /**
         * @method remove
         * @param {String} route
         * @param {Object} data
         */
        module.remove = function (route, data) {

            var deferred = $q.defer();

            $log.log('server::remove(', route, ':', data, ')');

            if (!route) {
                deferred.reject('No route passed');
            }
            if (!data) {
                deferred.reject('No data passed');
            }
            else {
                // Mocking here as we have no real http service defined
                switch (route.toLowerCase()) {
                    case 'datasets' :
                        return $timeout(angular.noop, 100 + Math.random() * 1000)
                            .then(function () {
                                return true;
                            });
                        break;
                    default :
                        deferred.reject('Unknown route passed');
                        break;
                }

            }
            return deferred.promise;
        };

        return module;
    });

