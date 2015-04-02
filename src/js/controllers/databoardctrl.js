/**
 * @ngdoc controller
 * @name app.controller:DataBoardCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */


angular.module('app')
    .controller('DataBoardCtrl', function ($scope, $log, data) {

        $scope.state = {
            isLoading: true
        };

        $scope.settings = {
            stages: {
                property: {
                    name: 'location'
                }
            },
            groups: {
                property: {
                    name: 'team'
                }
            },
            readonly: false
        };

        /**
         * @property datasets
         */
        $scope.datasets = [];

        /**
         * @method getStages
         * @returns {Array}
         */
        $scope.getStages = function () {
            return data.getStages($scope.settings.stages.property.name);
        };

        /**
         * @method init
         */
        $scope.init = function () {

            $log.log('DataBoardCtrl::init()');

            // Fetch all data
            data.fetch()
                .then(function (datasets) {
                    $scope.datasets = datasets;
                    $log.log(datasets);
                })
                .catch(function (err) {
                    $log.err(err);
                })
                .finally(function () {
                    $scope.state.isLoading = false;
                })
        };


        /**
         * @method addStage
         * @param {String} name
         */
        $scope.addStage = function (name) {
            if (!name || !name.length) {
                return;
            }
            data.stages.push(name);
        }

    });
