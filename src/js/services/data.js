/**
 * @ngdoc service
 * @name app.data
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $replace_me
 *
 * */


angular.module('app')
    .factory('data', function ($q, $log, server, _) {

        var module = {};

        var cache = {
            stages: []
        };

        /**
         * @property items
         * @type {Array}
         */
        module.items = [];

        /**
         * @property stages
         * @type {Array}
         */
        module.stages = [];

        /**
         * @method fetch
         * @returns {Promise}
         */
        module.fetch = function () {
            $log.log('data::fetch()');
            return server.fetch('datasets').then(function (datasets) {
                return module.items = datasets;
            });
        };

        /**
         * @method getStages
         * @param {String} propertyName
         * @returns {Array}
         */
        module.getStages = function (propertyName) {

            var stages = _(module.items)
                .pluck(propertyName)
                .concat(module.stages) // Add the static stages
                .sort()
                .unique()
                .map(function (stage) {
                    return {
                        key: _.kebabCase(stage),
                        title: stage
                    }
                })
                .value();

            // Return the cached version if there hasn't been any diff
            if (cache.stages && angular.equals(cache.stages, stages)) {
                return cache.stages;
            }
            else {
                cache.stages = stages;
                return stages;
            }

        };

        return module;
    });

