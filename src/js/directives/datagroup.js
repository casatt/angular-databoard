/**
 * @ngdoc directive
 * @name app.directive:datagroup
 *
 * @description
 * Represents a group of data that is separated vertically.
 *
 * @restrict A
 * */


angular.module('app')
    .directive('datagroup', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/datagroup.html',
            link: function (scope, element, attr) {
            }
        };
    });
