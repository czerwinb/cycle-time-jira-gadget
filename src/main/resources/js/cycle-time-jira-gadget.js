'use strict';

function calculateMetricsFor(jiraStatuses, searchResponse) {
    try {
        var metricsCalculator = createMetricsCalculator(jiraStatuses);
        metricsCalculator.processResponse(searchResponse);
        return createMetricsObject(metricsCalculator);
    } catch (e) {
        var message = new gadgets.MiniMessage();
        message.createDismissibleMessage("An error occurred while loading gadget.");
    }
}

function createMetricsCalculator(jiraStatuses) {
    var statusResolver = new JiraStatusResolver(jiraStatuses);
    return new MetricsCalculator(statusResolver);
}

function createMetricsObject(metricsCalculator) {
    var cycleTime = metricsCalculator.calculateAverageCycleTime();
    var leadTime = metricsCalculator.calculateAverageLeadTime();
    return {
        'cycleTime': {
            'average': cycleTime.toString()
        },
        'leadTime': {
            'average': leadTime.toString()
        }
    };
}