/**
 * @ngdoc directive
 * @name app.directive:databox
 *
 * @description
 * Represents a container for
 * a horizontal separation of data.
 *
 * @restrict A
 * @requires data
 * */


angular.module('app')
    .directive('databox', function (data) {
        return {
            restrict: 'E',
            templateUrl: 'templates/databox.html',
            link: function (scope, element, attr) {

                /**
                 * @method add
                 * @param {String} stage
                 */
                scope.add = function (stage) {
                    data.add(stage).then(function (dataset) {
                        scope.$emit('dataset:add', dataset);
                    });
                }
            }
        };
    })
;