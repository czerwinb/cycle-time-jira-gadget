'use strict';

let DateUtils = require('./date-utils');

let MetricsCalculator = (function () {
    function MetricsCalculator() {
        this.cycleTimes = [];
        this.leadTimes = [];
    }

    MetricsCalculator.prototype.processResponse = function (response) {
        try {
            response.issues.forEach(issue => {
                processIssue.call(this, issue);
            });
        } catch (e) {
            throw new Error("Invalid response");
        }
    };

    function processIssue(issue) {
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
            this.cycleTimes.push(issueCycleTime);
        }
        if (issueLeadTime > 0) {
            this.leadTimes.push(issueLeadTime);
        }
    }

    MetricsCalculator.prototype.calculateAverageCycleTime = function () {
        const averageCycleTime = calculateAverageFor(this.cycleTimes);
        return DateUtils.calculateDurationFor(averageCycleTime);
    };

    MetricsCalculator.prototype.calculateAverageLeadTime = function () {
        const averageLeadTime = calculateAverageFor(this.leadTimes);
        return DateUtils.calculateDurationFor(averageLeadTime);
    };

    MetricsCalculator.prototype.getIssuesIds = function (response) {
        let ids = [];
        try {
            response.issues.forEach(function (i) {
                ids.push(i.key);
            });
        } catch (e) {
            // Yummy, yummy
        }
        return ids;
    };

    function calculateAverageFor(arrayOfNumbers) {
        const sum = arrayOfNumbers.reduce(
            (prev, curr) => {
                return prev + curr;
            }, 0);
        return sum ? Math.floor(sum / arrayOfNumbers.length) : 0;
    }

    function isNotSet(cycleStartDate) {
        return !cycleStartDate;
    }

    function parseDate(date) {
        return new Date(date);
    }

    function isStatusTransition(historyItem) {
        return (historyItem.field === 'status')
            && (historyItem.from !== historyItem.to);
    }

    function isStatusNew(statusId) {
        const newStatuses = {
            '1': 'New',
            'New': '1'
        };
        return newStatuses.hasOwnProperty(statusId);
    }

    function isStatusDone(statusId) {
        const newStatuses = {
            // '3': 'Done',
            // 'Done': '3',
            '5': 'Resolved',
            'Resolved': '5',
            '6': 'Closed',
            'Closed': '6'

        };
        return newStatuses.hasOwnProperty(statusId);
    }

    function isStatusWIP(statusId) {
        return !(isStatusNew(statusId) || isStatusDone(statusId));
    }

    return MetricsCalculator;
}());


if (typeof module !== 'undefined' && module.exports) {
    module.exports = MetricsCalculator;
}
