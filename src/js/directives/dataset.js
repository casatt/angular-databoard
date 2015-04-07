/**
 * @ngdoc directive
 * @name app.directive:dataset
 *
 * @description
 * A dataset is the representation of a single dataset.
 *
 * @restrict A
 *
 * @requires $log
 * @requires $rootScope
 * @requires $window
 * */


angular.module('app')
    .directive('dataset', function ($log, $rootScope, $window) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/dataset.html',
            scope: {
                data: '=data'
            },
            link: function (scope, element, attr) {


                var id, group, stage;

                /**
                 * @private
                 * @method getIdGroupAndStageFromElement
                 */
                function getIdGroupAndStageFromElement() {
                    // Collect the identifiers from the DOM
                    id = element.attr('data-id');
                    group = element.parent().attr('data-group-name');
                    stage = element.parent().parent().attr('data-stage-name');
                }

                /**
                 * Event-listeners for the native drag-n-drop events
                 *
                 * @method
                 * @param {Object} e
                 * @listens dragstart
                 * @listens drag
                 * @listens dragend
                 */
                element.on('dragstart drag dragend', function (e) {

                    getIdGroupAndStageFromElement();

                    switch (e.type) {
                        case 'dragstart' :

                            // $log.log('dataset::dragstart');
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', id);

                            // Inform everyone about the dragstart
                            $rootScope.$broadcast('dataset:dragstart', {id: id, group: group, stage: stage});
                            element.addClass('js-dragging');

                            break;
                        case 'drag' :

                            //$log.log('dataset::drag');

                            break;
                        case 'dragend' :

                            //$log.log('dataset::dragend');
                            $rootScope.$broadcast('dataset:dragend', {id: id, group: group, stage: stage});
                            element.removeClass('js-dragging');

                            break;
                    }

                });


                /**
                 * @method remove
                 */
                scope.remove = function () {
                    if ($window.confirm('Are you sure you want to remove this employee from the board?')) {
                        getIdGroupAndStageFromElement();
                        scope.$emit('dataset:remove', {id: id});
                    }

                }

            }
        };
    });