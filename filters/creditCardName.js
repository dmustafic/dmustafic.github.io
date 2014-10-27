'use strict';

angular.module('driveStudioHU.filters').filter('ccname', function () {
    return function (creditCardNr) {
        if (!creditCardNr) { return ''; }

        var name = (/^5[1-5]/.test(creditCardNr)) ? "Mastercard"
                : (/^4/.test(creditCardNr)) ? "Visa"
                : (/^3[47]/.test(creditCardNr)) ? 'Amex'
                : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(creditCardNr)) ? 'Discover'
                : undefined;

        return name;
    };
});

