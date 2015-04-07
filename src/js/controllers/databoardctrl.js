/**
 * @ngdoc controller
 * @name app.controller:DataBoardCtrl
 *
 * @description
 * Controller for the databoard
 *
 * @requires $scope
 * @requires $log
 * @requires $filter
 * @requires data
 * @requires _
 * */


angular.module('app')
    .controller('DataBoardCtrl', function ($scope, $log, $filter, data, _) {

        /**
         * @property state
         * @type {{isLoading: boolean, isUpdating: boolean}}
         */
        $scope.state = {
            isLoading: true,
            isUpdating: false
        };

        /**
         * @property settings
         * @type {{stages: {property: {name: string}}, groups: {property: {name: string}}, readonly: boolean, search: null, filter: *[]}}
         */
        $scope.settings = {
            stages: {
                property: {
                    name: 'location'
                }
            },
            groups: {
                property: {
                    name: 'team'
                }
            },
            readonly: false,
            search: null,
            filter: [{
                label: 'Male',
                description: 'Male employees',
                active: false,
                func: function (employee) {
                    return employee.gender === 'Male';
                }
            }, {
                label: 'Female',
                description: 'Female employees',
                active: false,
                func: function (employee) {
                    return employee.gender === 'Female';
                }
            },
                {
                    name: 'teamFilter',
                    label: 'Team',
                    isSubfilter: true,
                    hasChildren: function () {
                        return this.values && this.values.length > 0;
                    },
                    values: [],
                    description: 'Filter by Team',

                    func: function (employee) {
                        return _(this.values)
                            .filter({active: true})
                            .map(function (value) {
                                return employee.team === value.value;
                            })
                            .reduce(function (total, partial) {
                                return total || partial;
                            });
                    }
                },
                {
                    name: 'locationFilter',
                    label: 'Location',
                    isSubfilter: true,
                    hasChildren: function () {
                        return this.values && this.values.length > 0;
                    },
                    values: [],
                    description: 'Filter by Location',

                    func: function (employee) {
                        return _(this.values)
                            .filter({active: true})
                            .map(function (value) {
                                return employee.location === value.value;
                            })
                            .reduce(function (total, partial) {
                                return total || partial;
                            });
                    }
                }
            ]

        };

        /**
         * @property datasets
         */
        $scope.datasets = [];


        /**
         * @private
         * @method filterChangeHandler
         */
        function filterChangeHandler() {

            var datasets = data.items;

            // Filter by search-text if defined
            if ($scope.settings.search) {
                datasets = $filter('filter')(datasets, {$: $scope.settings.search});
            }

            // Filter all datasets by custom filters
            datasets = _.filter(datasets, function (dataset) {

                //Call each filter function for the remaining datasets
                return _($scope.settings.filter)
                    .filter({active: true})
                    .invoke('func', dataset)
                    .reduce(function (total, partial) {
                        return total && partial;
                    }, true);

            });

            $scope.datasets = datasets;
        }


        /**
         * @private
         * @method updateFilters
         */
        function updateFilters() {

            /**
             * @private
             * @method update
             * @param {String} name
             * @param {Array} values
             */
            function update(name, values) {
                var filter = _.find($scope.settings.filter, {name: name});
                filter.active = true;
                filter.values = _.map(values, function (group) {
                    return {active: true, value: group.title, label: group.title};
                });
            }

            update('locationFilter', $scope.getStages());
            update('teamFilter', $scope.getGroups());

        }


        /**
         * @method getStages
         * @returns {Array}
         */
        $scope.getStages = function () {
            return data.getStages($scope.settings.stages.property.name);
        };

        /**
         * @method getGroups
         * @returns {Array}
         */
        $scope.getGroups = function () {
            return data.getGroups($scope.settings.groups.property.name);
        };

        /**
         * @method init
         */
        $scope.init = function () {

            $log.log('DataBoardCtrl::init()');

            // Fetch all datasets from the data service
            data.fetch()
                .then(function (datasets) {
                    $scope.datasets = datasets;
                })
                .catch(function (err) {
                    $log.err(err);
                })
                .finally(function () {
                    updateFilters();
                    $scope.state.isLoading = false;
                })
        };


        /**
         * @method
         * @param {Object} e
         * @param {Object} eventData
         * @listens dataset:update
         */
        $scope.$on('dataset:update', function (e, eventData) {

            if (!eventData || !eventData.id) {
                return;
            }

            $scope.state.isUpdating = true;

            data.update({id: eventData.id, team: eventData.group, location: eventData.stage})
                .finally(function () {
                    $scope.state.isUpdating = false;
                });
        });


        /**
         * @method
         * @param {Object} e
         * @param {Object} eventData
         * @listens dataset:remove
         */
        $scope.$on('dataset:remove', function (e, eventData) {

            if (!eventData || !eventData.id) {
                return;
            }
            $scope.state.isUpdating = true;

            data.remove({id: eventData.id})
                .finally(function () {
                    $scope.state.isUpdating = false;
                });
        });


        // If the filter settings are updated
        // repopulate the datasets
        $scope.$watch('settings.filter', filterChangeHandler, true);
        $scope.$watch('settings.search', filterChangeHandler);

    });
