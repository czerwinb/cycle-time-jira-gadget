'use strict';

const chai = require('chai');
const expect = chai.expect;

describe('JiraStatusResolver', () => {

    const JiraStatusResolver = require('../../main/javascript/jira-status-resolver');

    describe('rainy day scenarios', () => {
        it('should throw an error when no array is provided', () => {
            expect(() => {
                new JiraStatusResolver();
            }).to.throw(TypeError, 'Array expected');
        });

        it('should throw an error when an object is provided', () => {
            expect(() => {
                new JiraStatusResolver({});
            }).to.throw(TypeError, 'Array expected');
        });
    });

    describe('test against real API response data', () => {

        const STATUS_TO_DO_ID = '10000';
        const STATUS_IN_PROGRESS_ID = '3';
        const STATUS_DONE_ID = '10001';

        let statusResolver;

        beforeEach(() => {
            let jiraStatuses = require('../resources/jira-api-responses/api-2-status.json');
            statusResolver = new JiraStatusResolver(jiraStatuses);
        });

        describe('#isStatusNew()', () => {

            it('should match status of category new as New', () => {
                expect(statusResolver.isStatusNew(STATUS_TO_DO_ID)).to.be.true;
            });

            it('should not match status of category done as New', () => {
                expect(statusResolver.isStatusNew(STATUS_DONE_ID)).to.be.false;
            });

            it('should not match status of category indeterminate as New', () => {
                expect(statusResolver.isStatusNew(STATUS_IN_PROGRESS_ID)).to.be.false;
            });
        });

        describe('#isStatusDone()', () => {

            it('should match status of category done as Done', () => {
                expect(statusResolver.isStatusDone(STATUS_DONE_ID)).to.be.true;
            });

            it('should not match status of category new as Done', () => {
                expect(statusResolver.isStatusDone(STATUS_TO_DO_ID)).to.be.false;
            });

            it('should not match status of category indeterminate as Done', () => {
                expect(statusResolver.isStatusDone(STATUS_IN_PROGRESS_ID)).to.be.false;
            });
        });

        describe('#isStatusWIP()', () => {

            it('should match status of category indeterminate as WIP', () => {
                expect(statusResolver.isStatusWIP(STATUS_IN_PROGRESS_ID)).to.be.true;
            });

            it('should not match status of category new as WIP', () => {
                expect(statusResolver.isStatusWIP(STATUS_TO_DO_ID)).to.be.false;
            });

            it('should not match status of category done as New', () => {
                expect(statusResolver.isStatusWIP(STATUS_DONE_ID)).to.be.false;
            });
        });
    });
});
