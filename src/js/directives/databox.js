/**
 * @ngdoc directive
 * @name app.directive:databox
 *
 * @description
 * Represents a container for
 * a horizontal separation of data.
 *
 * @restrict A
 * */


angular.module('app')
    .directive('databox', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/databox.html',
            link: function (scope, element, attr) {
            }
        };
    });
