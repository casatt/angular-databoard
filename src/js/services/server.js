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
 * @requires chance
 *
 * */


angular.module('app')
    .factory('server', function ($q, $log, chance) {

        var module = {};


        /**
         * @method createEmployees
         * @param {Number} amount
         * @returns {Array}
         */
        function createEmployees(amount) {

            var teams = ['Finance', 'Human Resources', 'Development', 'Service', 'IT', 'Logistics'],
                locations = _.times(5, function () {
                    return chance.city();
                });

            // Let's create X random employees
            return _.times(amount, function () {

                return {
                    id: chance.hash({length: 16}),
                    firstname: chance.first(),
                    lastname: chance.last(),
                    gender: chance.gender(),
                    age: chance.age(),
                    email: chance.email(),
                    phone: chance.phone(),
                    location: locations[locations.length * Math.random() | 0],
                    team: teams[teams.length * Math.random() | 0]
                }

            })

        }

        /**
         * @method fetch
         * @returns {*|promise}
         */
        module.fetch = function (route) {
            var deferred = $q.defer();

            $log.log('server::fetch(' + route + ')');

            if (!route) {
                deferred.reject('No route passed');
            }
            else {
                // Mocking here as we have no real http service defined
                switch (route.toLowerCase()) {
                    case 'datasets' :
                        deferred.resolve(createEmployees(50));
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

