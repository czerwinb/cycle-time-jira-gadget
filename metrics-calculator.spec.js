'use strict';

const chai = require('chai');
const chaiArrays = require('chai-arrays');
const chaiAlso = require('chai-also');

chai.use(chaiArrays);
chai.use(chaiAlso);
const expect = chai.expect;

describe('MetricsCalculator', function () {

    const MetricsCalculator = require('./metrics-calculator');
    let metricsCalculator;

    beforeEach(() => {
        metricsCalculator = new MetricsCalculator();
    });

    describe('#getIssuesIds()', () => {

        it('should return an empty array for null request', () => {
            let ids = new MetricsCalculator().getIssuesIds(null);
            expect(ids).to.be.array().that.is.ofSize(0);
        });

        it('should return an empty array for an empty request', () => {
            let ids = new MetricsCalculator().getIssuesIds('');
            expect(ids).to.be.array().that.is.ofSize(0);
        });

        it('should return an empty array for an invalid request', () => {
            let ids = new MetricsCalculator().getIssuesIds('invalid request');
            expect(ids).to.be.array().that.is.ofSize(0);
        });

        it('should return an array of issues ids', () => {
            let response = require('./test-data/sample-3-issues.json');
            let ids = new MetricsCalculator().getIssuesIds(response);
            expect(ids).to.be.array();
            expect(ids).to.be.ofSize(3);
            expect(ids).to.be.containingAllOf(['ISSUE-23389', 'ISSUE-24177', 'ISSUE-24510']);
        });
    });

    describe('#processResponse()', () => {

        const EMPTY_RESPONSE = "";
        const INVALID_RESPONSE = {'invalid': 'response'};

        it('should throw an error for an empty reponse', () => {
            expect(() => {
                metricsCalculator.processResponse(EMPTY_RESPONSE);
            }).to.throw(Error, "Invalid response");
        });

        it('should throw an error for an invalid reponse', () => {
            expect(() => {
                metricsCalculator.processResponse(INVALID_RESPONSE);
            }).to.throw(Error, "Invalid response");
        });

        it('should calculate Cycle Time and Lead Time for ISSUE-123', () => {
            let response = require('./test-data/sample-ISSUE-123.json');

            metricsCalculator.processResponse(response);
            let averageCycleTime = metricsCalculator.calculateAverageCycleTime();
            let averageLeadTime = metricsCalculator.calculateAverageLeadTime();

            expect(averageCycleTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 0).and.also
                .that.has.nested.property('days', 0).and.also
                .that.has.nested.property('hours', 0).and.also
                .that.has.nested.property('minutes', 0).and.also
                .that.has.nested.property('seconds', 4).and.also
                .that.has.nested.property('duration.millis', 4824).and.also
                .that.has.nested.property('duration.seconds', 4);
            expect(averageLeadTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 0).and.also
                .that.has.nested.property('days', 1).and.also
                .that.has.nested.property('hours', 23).and.also
                .that.has.nested.property('minutes', 0).and.also
                .that.has.nested.property('seconds', 36).and.also
                .that.has.nested.property('duration.millis', 169236818).and.also
                .that.has.nested.property('duration.seconds', 169236);
        });

        it('should calculate Cycle Time and Lead Time for ISSUE-24510', () => {
            let response = require('./test-data/sample-ISSUE-24510.json');

            metricsCalculator.processResponse(response);
            let averageCycleTime = metricsCalculator.calculateAverageCycleTime();
            let averageLeadTime = metricsCalculator.calculateAverageLeadTime();

            expect(averageCycleTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 0).and.also
                .that.has.nested.property('days', 0).and.also
                .that.has.nested.property('hours', 0).and.also
                .that.has.nested.property('minutes', 0).and.also
                .that.has.nested.property('seconds', 0).and.also
                .that.has.nested.property('duration.millis', 0).and.also
                .that.has.nested.property('duration.seconds', 0);
            expect(averageLeadTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 0).and.also
                .that.has.nested.property('days', 0).and.also
                .that.has.nested.property('hours', 23).and.also
                .that.has.nested.property('minutes', 40).and.also
                .that.has.nested.property('seconds', 52).and.also
                .that.has.nested.property('duration.millis', 85252115).and.also
                .that.has.nested.property('duration.seconds', 85252);
        });

        it('should calculate Cycle Time and Lead Time for ISSUE-24177', () => {
            let response = require('./test-data/sample-ISSUE-24177.json');

            metricsCalculator.processResponse(response);
            let averageCycleTime = metricsCalculator.calculateAverageCycleTime();
            let averageLeadTime = metricsCalculator.calculateAverageLeadTime();

            expect(averageCycleTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 0).and.also
                .that.has.nested.property('days', 4).and.also
                .that.has.nested.property('hours', 15).and.also
                .that.has.nested.property('minutes', 13).and.also
                .that.has.nested.property('seconds', 5).and.also
                .that.has.nested.property('duration.millis', 400385960).and.also
                .that.has.nested.property('duration.seconds', 400385);
            expect(averageLeadTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 2).and.also
                .that.has.nested.property('days', 1).and.also
                .that.has.nested.property('hours', 11).and.also
                .that.has.nested.property('minutes', 3).and.also
                .that.has.nested.property('seconds', 32).and.also
                .that.has.nested.property('duration.millis', 1335812650).and.also
                .that.has.nested.property('duration.seconds', 1335812);
        });

        it('should calculate Cycle Time and Lead Time for ISSUE-23389', () => {
            let response = require('./test-data/sample-ISSUE-23389.json');

            metricsCalculator.processResponse(response);
            let averageCycleTime = metricsCalculator.calculateAverageCycleTime();
            let averageLeadTime = metricsCalculator.calculateAverageLeadTime();

            expect(averageCycleTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 1).and.also
                .that.has.nested.property('days', 2).and.also
                .that.has.nested.property('hours', 17).and.also
                .that.has.nested.property('minutes', 12).and.also
                .that.has.nested.property('seconds', 59).and.also
                .that.has.nested.property('duration.millis', 839579477).and.also
                .that.has.nested.property('duration.seconds', 839579);
            expect(averageLeadTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 5).and.also
                .that.has.nested.property('days', 6).and.also
                .that.has.nested.property('hours', 19).and.also
                .that.has.nested.property('minutes', 36).and.also
                .that.has.nested.property('seconds', 57).and.also
                .that.has.nested.property('duration.millis', 3613017074).and.also
                .that.has.nested.property('duration.seconds', 3613017);

        });

        it('should calculate Cycle Time and Lead Time for 2 issues', () => {
            let response = require('./test-data/sample-2-issues.json');

            metricsCalculator.processResponse(response);
            let averageCycleTime = metricsCalculator.calculateAverageCycleTime();
            let averageLeadTime = metricsCalculator.calculateAverageLeadTime();

            expect(averageCycleTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 0).and.also
                .that.has.nested.property('days', 4).and.also
                .that.has.nested.property('hours', 15).and.also
                .that.has.nested.property('minutes', 13).and.also
                .that.has.nested.property('seconds', 5).and.also
                .that.has.nested.property('duration.millis', 400385960).and.also
                .that.has.nested.property('duration.seconds', 400385);
            expect(averageLeadTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 1).and.also
                .that.has.nested.property('days', 1).and.also
                .that.has.nested.property('hours', 5).and.also
                .that.has.nested.property('minutes', 22).and.also
                .that.has.nested.property('seconds', 12).and.also
                .that.has.nested.property('duration.millis', 710532382).and.also
                .that.has.nested.property('duration.seconds', 710532);

        });

        it('should calculate Cycle Time and Lead Time for 3 issues', () => {
            let response = require('./test-data/sample-3-issues.json');

            metricsCalculator.processResponse(response);
            let averageCycleTime = metricsCalculator.calculateAverageCycleTime();
            let averageLeadTime = metricsCalculator.calculateAverageLeadTime();

            expect(averageCycleTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 1).and.also
                .that.has.nested.property('days', 0).and.also
                .that.has.nested.property('hours', 4).and.also
                .that.has.nested.property('minutes', 13).and.also
                .that.has.nested.property('seconds', 2).and.also
                .that.has.nested.property('duration.millis', 619982718).and.also
                .that.has.nested.property('duration.seconds', 619982);
            expect(averageLeadTime)
                .to.be.an('object')
                .that.has.nested.property('weeks', 2).and.also
                .that.has.nested.property('days', 5).and.also
                .that.has.nested.property('hours', 10).and.also
                .that.has.nested.property('minutes', 7).and.also
                .that.has.nested.property('seconds', 7).and.also
                .that.has.nested.property('duration.millis', 1678027279).and.also
                .that.has.nested.property('duration.seconds', 1678027);

        });
    });
});