/**
 * @ngdoc service
 * @name app.data
 * @description
 * The service that is used for all
 * the CRUD-operations in the databoard.
 *
 * @requires $q
 * @requires $log
 * @requires server
 * @requires _
 * @requires datastages
 * @requires datagroups
 *
 * */


angular.module('app')
    .factory('data', function ($q, $log, server, _, datastages, datagroups) {

        var module = {};

        /**
         * @private
         * @property cache
         * @type {{groups: Array, stages: Array}}
         */
        var cache = {
            groups: [],
            stages: []
        };


        /**
         * @private
         * @method getPropertyValuesFromItems
         * @param {String} propertyName
         * @param {Array} constantValues
         * @returns {*}
         */
        function getPropertyValuesFromItems(propertyName, constantValues) {

            var values = _(module.items)
                .pluck(propertyName)
                .concat(constantValues) // Add the static stages
                .sort()
                .unique()
                .map(function (value) {
                    return {
                        key: _.kebabCase(value),
                        title: value
                    }
                })
                .value();

            // Return the cached version if there hasn't been any diff
            if (cache[propertyName] && angular.equals(cache[propertyName], values)) {
                return cache[propertyName];
            }
            else {
                cache[propertyName] = values;
                return values;
            }
        }

        /**
         * @property items
         * @type {Array}
         */
        module.items = [];

        /**
         * @property stages
         * @type {Array}
         */
        module.stages = datastages;

        /**
         * @property groups
         * @type {Array}
         */
        module.groups = datagroups;


        /**
         * @method fetch
         * @returns {Promise}
         */
        module.fetch = function () {
            $log.log('data::fetch()');
            return server.fetch('datasets')
                .then(function (datasets) {
                    return module.items = datasets;
                });
        };

        /**
         * @method getStages
         * @param {String} propertyName
         * @returns {Array}
         */
        module.getStages = function (propertyName) {
            return getPropertyValuesFromItems(propertyName, module.stages);
        };

        /**
         * @method getGroups
         * @param {String} propertyName
         * @returns {Array}
         */
        module.getGroups = function (propertyName) {
            return getPropertyValuesFromItems(propertyName, module.groups);
        };


        /**
         * Adds a dataset to the collection
         *
         * @method add
         * @param dataset
         */
        module.add = function (dataset) {
            //TODO implement add functionality (non-persistent)
        };

        /**
         * Updates a dataset
         *
         * @method update
         * @param {Object} dataset
         * @returns {Promise}
         */
        module.update = function (dataset) {

            $log.log('data::update(', dataset, ')');

            var index = _.findIndex(module.items, {id: dataset.id}),
                cache = angular.copy(module.items[index]);

            // Updating locally
            module.items[index] = _.assign(module.items[index], dataset);

            // Let's assume that the validation on the server is not
            // that strict, the uptime is great and we won't get any errors
            // while updating that often
            return server.update('datasets', module.items[index])
                .then(function (dataset) {
                    module.items[index] = dataset;
                })
                .catch(function (err) {
                    $log.error(err);
                    module.items[index] = cache;
                })
                .finally(function () {
                    return module.items;
                })
        };


        /**
         * @method remove
         * @param {Object} dataset
         */
        module.remove = function (dataset) {
            //TODO implement remove functionality
        };

        return module;
    });

