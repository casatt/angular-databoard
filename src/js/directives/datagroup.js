/**
 * @ngdoc directive
 * @name app.directive:datagroup
 *
 * @description
 * _Please update the description and restriction._
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
