'use strict';

function processResponse(response) {
    let DateUtils = require('./date-utils');
    let cycleTimes = [];
    let leadTimes = [];

    response.issues.forEach(issue => {
        let issueLeadTime = 0;
        let issueCycleTime = 0;
        let prevTransitionDate = parseDate(issue.fields.created);
        let cycleStartDate = null;

        issue.changelog.histories.forEach(history => {
            history.items
                .filter(transition => isStatusTransition(transition))
                .forEach(transition => {
                    const transitionDate = parseDate(history.created);

                    // Update Cycle Time
                    if (isStatusWIP(transition.to) && isNotSet(cycleStartDate)) {
                        cycleStartDate = transitionDate;
                    } else if (!isStatusWIP(transition.to) && cycleStartDate) {
                        let duration = DateUtils.calculateDurationBetween(cycleStartDate, transitionDate);
                        issueCycleTime += duration.duration.millis;
                        cycleStartDate = null;
                    }

                    // Update Lead Time
                    if (!isStatusDone(transition.from) && isStatusDone(transition.to)) {
                        let duration = DateUtils.calculateDurationBetween(prevTransitionDate, transitionDate);
                        issueLeadTime += duration.duration.millis;
                        prevTransitionDate = null;
                    } else if ((isStatusDone(transition.from) || isStatusNew(transition.to)) && !prevTransitionDate) {
                        prevTransitionDate = transitionDate;
                    }
                });
        });

        if (issueCycleTime > 0) {
            cycleTimes.push(issueCycleTime);
        }
        if (issueLeadTime > 0) {
            leadTimes.push(issueLeadTime);
        }
    });

    let averageCycleTime = calculateAverageFor(cycleTimes);
    let averageLeadTime = calculateAverageFor(leadTimes);

    console.log('Cycle Time: ', DateUtils.calculateDurationFor(averageCycleTime));
    console.log('Lead Time: ', DateUtils.calculateDurationFor(averageLeadTime));

    return {
        "cycle-time": {'average': DateUtils.calculateDurationFor(averageCycleTime)},
        "lead-time": {'average': DateUtils.calculateDurationFor(averageLeadTime)}
    };
}

function calculateAverageFor(arrayOfNumbers) {
    return arrayOfNumbers.reduceRight((prev, curr, index, arr) => {
        if (index === 0) {
            let total = prev + curr;
            return Math.floor(total / arr.length);
        }
        return prev + curr;
    }, 0);
}

function isNotSet(cycleStartDate) {
    return !cycleStartDate;
}

function parseDate(date) {
    let creationDate = new Date(date);
    return creationDate;
}

function isStatusTransition(historyItem) {
    return (historyItem.field === 'status')
        && (historyItem.from !== historyItem.to);
}

function isStatusNew(statusId) {
    const newStatuses = {
        '1': 'New',
        'New': '1'
    }
    return newStatuses.hasOwnProperty(statusId)
}

function isStatusDone(statusId) {
    const newStatuses = {
        // '3': 'Done',
        // 'Done': '3',
        '5': 'Resolved',
        'Resolved': '5',
        '6': 'Closed',
        'Closed': '6'

    }
    return newStatuses.hasOwnProperty(statusId)
}

function isStatusWIP(statusId) {
    return !(isStatusNew(statusId) || isStatusDone(statusId));
}

function getIssuesIds(response) {
    let ids = [];
    try {
        response.issues.forEach(function (i) {
            ids.push(i.key);
        });
    } catch (e) {
        // Yummy, yummy
    }
    return ids;
}


if (typeof exports !== 'undefined') {
    exports.getIssuesIds = getIssuesIds;
    exports.processResponse = processResponse;
}
