/**
 * @ngdoc directive
 * @name app.directive:dataset
 *
 * @description
 * A dataset is the representation of a single dataset.
 *
 * @restrict A
 * */


angular.module('app')
    .directive('dataset', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/dataset.html',
            scope: {
                data: '=data'
            },
            link: function (scope, element, attr) {

            }
        };
    });
