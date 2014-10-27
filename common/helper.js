'use strict';

angular.module('driveStudioHU.helpers')
    .factory('helper', [
    function() {

        return {

            group: function(list, itemsNr) {
                var result = [],
                    set = [];
                _.each(list, function(p, index) {
                    if (index > 0 && index % itemsNr == 0) {
                        result.push(set);
                        set = [];
                        set.push(p);
                    } else set.push(p);
                });

                if (set.length > 0)
                    result.push(set);

                return result;
            }

        };
    }
]);

