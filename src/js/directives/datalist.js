/**
 * @ngdoc directive
 * @name app.directive:datalist
 *
 * @description
 * A datalist is the actual representation of the horizontal separated data.
 * It might contain several datagroups.
 *
 * @restrict A
 * */


angular.module('app')
    .directive('datalist', function () {
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

                var cache = {
                    groups: []
                };

                /**
                 * @method getDataGroups
                 * @returns {*}
                 */
                scope.getDataGroups = function () {

                    var groups = _(scope.data)
                        .filter(function (dataset) {
                            return dataset[scope.property] === scope.value;
                        })
                        .groupBy(scope.groupBy)
                        .map(function (group, name) {
                            return {
                                name: name,
                                data: group
                            }
                        })
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
