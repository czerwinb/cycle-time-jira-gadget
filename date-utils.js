'use strict';

/**
 * Calculate time difference in milliseconds between passed dates.
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {Number} a number representing time difference in milliseconds.
 */
function calculateMillisBetween(dateA, dateB) {
    _validateArguments(dateA, dateB);

    var msA = dateA.getTime();
    var msB = dateB.getTime();

    return Math.abs(msB - msA);
}

/**
 * Calculate duration between passed dates.
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {object} an object representing duration.
 */
function calculateDurationBetween(dateA, dateB) {
    _validateArguments(dateA, dateB);
    var millisBetween = calculateMillisBetween(dateA, dateB);

    return calculateDurationFor(millisBetween);
}

/**
 * Calculates duration for passed time in milliseconds.
 *
 * @param {Number} timeInMillis
 * @returns {object} an object representing duration.
 */
function calculateDurationFor(timeInMillis) {
    var secondsBetween = Math.floor(Math.abs(timeInMillis / 1000));
    var seconds = Math.floor(secondsBetween % 60);
    var minutes = Math.floor(secondsBetween / 60 % 60);
    var hours = Math.floor(secondsBetween / 3600 % 24);
    var days = Math.floor(secondsBetween / 86400 % 7);
    var weeks = Math.floor(secondsBetween / 604800);

    return {
        "weeks": weeks,
        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
        "duration": {
            "millis": timeInMillis,
            "seconds": secondsBetween
        }
    };
}

function _validateArguments(dateA, dateB) {
    if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
        throw new TypeError('all arguments must be of type Date');
    }
}


if (typeof exports !== 'undefined') {
    exports.calculateMillisBetween = calculateMillisBetween;
    exports.calculateDurationBetween = calculateDurationBetween;
    exports.calculateDurationFor = calculateDurationFor;
}
