/**
 * @ngdoc directive
 * @name app.directive:datalist
 *
 * @description
 * _Please update the description and restriction._
 *
 * @restrict A
 * */


angular.module('app')
    .directive('dataset', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/dataset.html',
            scope: {
                data: '=data'
            },
            link: function (scope, element, attr) {

            }
        };
    });
