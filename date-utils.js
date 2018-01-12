'use strict';

/**
 * Calculate time difference in milliseconds between passed dates.
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {Number} a number representing time difference in milliseconds.
 */
let calculateMillisBetween = function (dateA, dateB) {
    _validateArguments(dateA, dateB);

    let msA = dateA.getTime();
    let msB = dateB.getTime();

    return Math.abs(msB - msA);
};

/**
 * Calculate duration between passed dates.
 *
 * @param {Date} dateA
 * @param {Date} dateB
 * @returns {object} an object representing duration.
 */
let calculateDurationBetween = function (dateA, dateB) {
    _validateArguments(dateA, dateB);
    let millisBetween = calculateMillisBetween(dateA, dateB);

    return calculateDurationFor(millisBetween);
};

/**
 * Calculates duration for passed time in milliseconds.
 *
 * @param {Number} timeInMillis
 * @returns {object} an object representing duration.
 */
let calculateDurationFor = function (timeInMillis) {
    let secondsBetween = Math.floor(Math.abs(timeInMillis / 1000));
    let seconds = Math.floor(secondsBetween % 60);
    let minutes = Math.floor(secondsBetween / 60 % 60);
    let hours = Math.floor(secondsBetween / 3600 % 24);
    let days = Math.floor(secondsBetween / 86400 % 7);
    let weeks = Math.floor(secondsBetween / 604800);

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
};

function _validateArguments(dateA, dateB) {
    if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
        throw new TypeError('all arguments must be of type Date');
    }
}


let DateUtils = {
    calculateMillisBetween: calculateMillisBetween,
    calculateDurationBetween: calculateDurationBetween,
    calculateDurationFor: calculateDurationFor
};

if (typeof module !== "undefined" && typeof module.exports === "object") {
    module.exports = DateUtils;
}
