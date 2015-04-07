/**
 * @ngdoc filter
 * @name app.filter:phoneFormat
 *
 * @description
 * Converts a formatted phone number (e.g. (319) 937-4783
 * to a phone number without any none numeric values except '+'
 * e.g. +493199374783
 *
 * */


angular.module('app')
    .filter('phoneFormat', function () {
        return function (input, type) {

            type = type || 'link';

            if (!input) {
                return;
            }

            switch (type.toLowerCase()) {
                default:
                case 'link' :
                    return input.toString().replace(/[^0-9+]/g, '');
            }

        };
    });
