'use strict';

let DateUtils = require('./date-utils');

let MetricsCalculator = (function () {

    function MetricsCalculator(jiraStatusResolver) {
        this.cycleTimes = [];
        this.leadTimes = [];
        this.jiraStatusResolver = jiraStatusResolver;
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
        const issueProcessor = new IssueProcessor(this.jiraStatusResolver);
        const issueMetrics = issueProcessor.processIssue(issue);
        if (issueMetrics.cycleTime > 0) {
            this.cycleTimes.push(issueMetrics.cycleTime);
        }
        if (issueMetrics.leadTime > 0) {
            this.leadTimes.push(issueMetrics.leadTime);
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

    function calculateAverageFor(arrayOfNumbers) {
        const sum = arrayOfNumbers.reduce(
            (prev, curr) => {
                return prev + curr;
            }, 0);
        return sum ? Math.floor(sum / arrayOfNumbers.length) : 0;
    }

    return MetricsCalculator;
}());

let IssueProcessor = (function () {

    function IssueProcessor(statusResolver) {
        this.statusResolver = statusResolver;
        this.issueLeadTime = 0;
        this.issueCycleTime = 0;
        this.prevTransitionDate = null;
        this.cycleStartDate = null;
    }

    IssueProcessor.prototype.processIssue = function (issue) {
        this.prevTransitionDate = parseDate(issue.fields.created);

        issue.changelog.histories.forEach(history => {
            this.processHistory(history);
        });

        return {
            cycleTime: this.issueCycleTime,
            leadTime: this.issueLeadTime
        };
    };

    IssueProcessor.prototype.processHistory = function (history) {
        const transitionDate = parseDate(history.created);

        history.items
            .filter(historyItem => this.isStatusTransition(historyItem))
            .forEach(transition => {
                this.processTransition(transition, transitionDate);
            });
    };

    IssueProcessor.prototype.processTransition = function (transition, transitionDate) {
        this.updateCycleTime(transition, transitionDate);
        this.updateLeadTime(transition, transitionDate);
    };

    IssueProcessor.prototype.updateCycleTime = function (transition, transitionDate) {
        if (this.isStatusWIP(transition.to) && isNotSet(this.cycleStartDate)) {
            this.cycleStartDate = transitionDate;
        } else if (!this.isStatusWIP(transition.to) && this.cycleStartDate) {
            let duration = DateUtils.calculateDurationBetween(this.cycleStartDate, transitionDate);
            this.issueCycleTime += duration.duration.millis;
            this.cycleStartDate = null;
        }
    };

    IssueProcessor.prototype.updateLeadTime = function (transition, transitionDate) {
        if (!this.isStatusDone(transition.from) && this.isStatusDone(transition.to)) {
            let duration = DateUtils.calculateDurationBetween(this.prevTransitionDate, transitionDate);
            this.issueLeadTime += duration.duration.millis;
            this.prevTransitionDate = null;
        } else if ((this.isStatusDone(transition.from) || this.isStatusNew(transition.to)) && !this.prevTransitionDate) {
            this.prevTransitionDate = transitionDate;
        }
    };

    IssueProcessor.prototype.isStatusTransition = function (historyItem) {
        return (historyItem.field === 'status')
            && (historyItem.from !== historyItem.to);
    };
    IssueProcessor.prototype.isStatusNew = function (statusId) {
        return this.statusResolver.isStatusNew(statusId);
    };

    IssueProcessor.prototype.isStatusDone = function (statusId) {
        return this.statusResolver.isStatusDone(statusId);
    };

    IssueProcessor.prototype.isStatusWIP = function (statusId) {
        return this.statusResolver.isStatusWIP(statusId);
    };

    function isNotSet(cycleStartDate) {
        return !cycleStartDate;
    }

    function parseDate(date) {
        return new Date(date);
    }

    return IssueProcessor;
}());

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MetricsCalculator;
}
