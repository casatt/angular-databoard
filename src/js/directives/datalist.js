/**
 * @ngdoc directive
 * @name app.directive:datalist
 *
 * @description
 * A datalist is the actual representation of the horizontal separated data.
 * It might contain several datagroups.
 *
 * @restrict E
 *
 * @requires datagroups
 * */


angular.module('app')
    .directive('datalist', function (datagroups) {
        return {
            restrict: 'E',
            templateUrl: 'templates/datalist.html',
            scope: {
                data: '=data',
                property: '=property',
                value: '=value',
                groupBy: '=groupBy',
                readonly: '=readonly'
            },
            link: function (scope, element, attr) {

                /**
                 * @private
                 * @property
                 * @type {{groups: Array}}
                 */
                var cache = {
                    groups: []
                };

                /**
                 * @method getDataGroups
                 * @returns {Array}
                 */
                scope.getDataGroups = function () {

                    var datasets, groups;

                    datasets = _.filter(scope.data, function (dataset) {
                        return dataset[scope.property] === scope.value;
                    });

                    groups = _(datasets)
                        .pluck(scope.groupBy)
                        .concat(datagroups)
                        .unique()
                        .map(function (groupName) {
                            return {
                                name: groupName,
                                data: _.filter(datasets, function (dataset) {
                                    return dataset[scope.groupBy] === groupName;
                                })
                            }
                        })
                        .sortBy('name')
                        .value();


                    if (cache.groups && angular.equals(cache.groups, groups)) {
                        return cache.groups;
                    }
                    else {
                        return cache.groups = groups;
                    }
                }
            }
        };
    });