'use strict';

class JiraStatusResolver {

    constructor(jiraStatuses) {
        if (!Array.isArray(jiraStatuses)) {
            throw new TypeError('Array expected');
        }
        this.jiraStatuses = jiraStatuses;
    }

    isStatusNew(statusId) {
        return this._matchStatusToCategory(statusId, 'new');
    }

    isStatusDone(statusId) {
        return this._matchStatusToCategory(statusId, 'done');
    }

    isStatusWIP(statusId) {
        return this._matchStatusToCategory(statusId, 'indeterminate');
    }

    _matchStatusToCategory(statusId, statusCategoryKey) {
        return this.jiraStatuses.some((status) => {
            if (statusId === status['id']) {
                return statusCategoryKey === status['statusCategory']['key'];
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JiraStatusResolver;
}
