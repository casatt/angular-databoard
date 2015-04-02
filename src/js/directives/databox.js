/**
 * @ngdoc directive
 * @name app.directive:databox
 *
 * @description
 * _Please update the description and restriction._
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
