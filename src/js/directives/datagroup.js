/**
 * @ngdoc directive
 * @name app.directive:datagroup
 *
 * @description
 * Represents a group of data that is separated vertically.
 *
 * @restrict E
 * @requires $log
 * @requires data
 * */


angular.module('app')
    .directive('datagroup', function ($log, data) {
        return {
            restrict: 'E',
            templateUrl: 'templates/datagroup.html',
            link: function (scope, element, attr) {

                var datasetId, group, stage;

                /**
                 * @private
                 * @method getGroupAndStagePropertyFromElement
                 */
                function getGroupAndStagePropertyFromElement() {
                    group = element.attr('data-group-name');
                    stage = element.parent().attr('data-stage-name');
                }

                // When a drag-operations starts, (nearly) every datagroup
                // needs to get a invisible overlay for the dragover/dragenter/dragleave-handling
                scope.$on('dataset:dragstart', function (e, eventData) {
                    getGroupAndStagePropertyFromElement();

                    // When a drag-operations starts, we store the id of the current dataset
                    // to be able to distinguish later on a drop event
                    datasetId = eventData.id;

                    // The group where the dataset is coming from shouldn't get
                    // the overlay for the drag-drop handling, as we would lose
                    // focus of the element currently being dragged and it reduces
                    // the amount of unnecessary requests as we don't trigger an update
                    // without any changes
                    if (group !== eventData.group || stage !== eventData.stage) {
                        element.addClass('js-droppable');
                    }
                });


                // When a drag-operation ends, the datagroup overlays need to be removed again
                scope.$on('dataset:dragend', function (e, eventData) {
                    element.removeClass('js-droppable');
                });


                /**
                 * Event-listeners for the native drag-n-drop events
                 *
                 * @method
                 * @param {Object} e
                 * @listens dragenter
                 * @listens dragover
                 * @listens dragleave
                 * @listens drop
                 */
                element.on('dragenter dragover dragleave drop', function (e) {

                    e.preventDefault();

                    switch (e.type) {
                        case 'dragenter' :
                            //$log.log('datagroup::dragenter');
                            element.addClass('js-dragover');
                            break;
                        case 'dragleave' :
                            //$log.log('datagroup::dragleave');
                            element.removeClass('js-dragover');
                            break;
                        case 'drop' :
                            //$log.log('datagroup::drop');
                            getGroupAndStagePropertyFromElement();
                            element.removeClass('js-dragover');
                            scope.$emit('dataset:update', {
                                id: datasetId,
                                group: group,
                                stage: stage
                            });
                            break;

                    }
                });


                /**
                 * @method add
                 */
                scope.add = function () {
                    getGroupAndStagePropertyFromElement();
                    data.add(stage, group).then(function (dataset) {
                        scope.$emit('dataset:add', dataset);
                    });
                }
            }
        };
    });