'use strict';

const chai = require('chai');
const chaiArrays = require('chai-arrays');
const chaiAlso = require('chai-also');
chai.use(chaiArrays);
chai.use(chaiAlso);
const expect = chai.expect;

describe('JiraUtil', function () {
    var JiraUtil = require('./metrics-calculator');

    describe('#getIssuesIds()', function () {
        it('should return an empty array for null request', function () {
            var ids = JiraUtil.getIssuesIds(null);
            expect(ids).to.be.array().that.is.ofSize(0);
        });

        it('should return an empty array for an empty request', function () {
            var ids = JiraUtil.getIssuesIds('');
            expect(ids).to.be.array().that.is.ofSize(0);
        });

        it('should return an empty array for an invalid request', function () {
            var ids = JiraUtil.getIssuesIds('invalid request');
            expect(ids).to.be.array().that.is.ofSize(0);
        });

        it('should return an array of issues ids', function () {
            var response = require('./test-data/sample-3-issues.json')
            var ids = JiraUtil.getIssuesIds(response);
            expect(ids).to.be.array();
            expect(ids).to.be.ofSize(3);
            expect(ids).to.be.containingAllOf(['ISSUE-23389', 'ISSUE-24177', 'ISSUE-24510']);
        });
    });

    describe('#processResponse()', function () {
        it('ISSUE-123', function () {
            let response = require('./test-data/sample-ISSUE-123.json')
            let metrics = JiraUtil.processResponse(response);

            expect(metrics)
                .to.be.an('object')
                .that.has.nested.property('lead-time.average.weeks', 0).and.also
                .that.has.nested.property('lead-time.average.days', 1).and.also
                .that.has.nested.property('lead-time.average.hours', 23).and.also
                .that.has.nested.property('lead-time.average.minutes', 0).and.also
                .that.has.nested.property('lead-time.average.seconds', 36).and.also
                .that.has.nested.property('lead-time.average.duration.millis', 169236818).and.also
                .that.has.nested.property('lead-time.average.duration.seconds', 169236).and.also
                .that.has.nested.property('cycle-time.average.weeks', 0).and.also
                .that.has.nested.property('cycle-time.average.days', 0).and.also
                .that.has.nested.property('cycle-time.average.hours', 0).and.also
                .that.has.nested.property('cycle-time.average.minutes', 0).and.also
                .that.has.nested.property('cycle-time.average.seconds', 4).and.also
                .that.has.nested.property('cycle-time.average.duration.millis', 4824).and.also
                .that.has.nested.property('cycle-time.average.duration.seconds', 4);
        });

        it('ISSUE-24510', function () {
            let response = require('./test-data/sample-ISSUE-24510.json')
            let metrics = JiraUtil.processResponse(response);

            expect(metrics)
                .to.be.an('object')
                .that.has.nested.property('lead-time.average.weeks', 0).and.also
                .that.has.nested.property('lead-time.average.days', 0).and.also
                .that.has.nested.property('lead-time.average.hours', 23).and.also
                .that.has.nested.property('lead-time.average.minutes', 40).and.also
                .that.has.nested.property('lead-time.average.seconds', 52).and.also
                .that.has.nested.property('lead-time.average.duration.millis', 85252115).and.also
                .that.has.nested.property('lead-time.average.duration.seconds', 85252).and.also
                .that.has.nested.property('cycle-time.average.weeks', 0).and.also
                .that.has.nested.property('cycle-time.average.days', 0).and.also
                .that.has.nested.property('cycle-time.average.hours', 0).and.also
                .that.has.nested.property('cycle-time.average.minutes', 0).and.also
                .that.has.nested.property('cycle-time.average.seconds', 0).and.also
                .that.has.nested.property('cycle-time.average.duration.millis', 0).and.also
                .that.has.nested.property('cycle-time.average.duration.seconds', 0);
        });

        it('ISSUE-24177', function () {
            let response = require('./test-data/sample-ISSUE-24177.json')
            let metrics = JiraUtil.processResponse(response);

            expect(metrics)
                .to.be.an('object')
                .that.has.nested.property('lead-time.average.weeks', 2).and.also
                .that.has.nested.property('lead-time.average.days', 1).and.also
                .that.has.nested.property('lead-time.average.hours', 11).and.also
                .that.has.nested.property('lead-time.average.minutes', 3).and.also
                .that.has.nested.property('lead-time.average.seconds', 32).and.also
                .that.has.nested.property('lead-time.average.duration.millis', 1335812650).and.also
                .that.has.nested.property('lead-time.average.duration.seconds', 1335812).and.also
                .that.has.nested.property('cycle-time.average.weeks', 0).and.also
                .that.has.nested.property('cycle-time.average.days', 4).and.also
                .that.has.nested.property('cycle-time.average.hours', 15).and.also
                .that.has.nested.property('cycle-time.average.minutes', 13).and.also
                .that.has.nested.property('cycle-time.average.seconds', 5).and.also
                .that.has.nested.property('cycle-time.average.duration.millis', 400385960).and.also
                .that.has.nested.property('cycle-time.average.duration.seconds', 400385);
        });

        it('ISSUE-23389', function () {
            let response = require('./test-data/sample-ISSUE-23389.json')
            let metrics = JiraUtil.processResponse(response);

            expect(metrics)
                .to.be.an('object')
                .that.has.nested.property('lead-time.average.weeks', 5).and.also
                .that.has.nested.property('lead-time.average.days', 6).and.also
                .that.has.nested.property('lead-time.average.hours', 19).and.also
                .that.has.nested.property('lead-time.average.minutes', 36).and.also
                .that.has.nested.property('lead-time.average.seconds', 57).and.also
                .that.has.nested.property('lead-time.average.duration.millis', 3613017074).and.also
                .that.has.nested.property('lead-time.average.duration.seconds', 3613017).and.also
                .that.has.nested.property('cycle-time.average.weeks', 1).and.also
                .that.has.nested.property('cycle-time.average.days', 2).and.also
                .that.has.nested.property('cycle-time.average.hours', 17).and.also
                .that.has.nested.property('cycle-time.average.minutes', 12).and.also
                .that.has.nested.property('cycle-time.average.seconds', 59).and.also
                .that.has.nested.property('cycle-time.average.duration.millis', 839579477).and.also
                .that.has.nested.property('cycle-time.average.duration.seconds', 839579);

        });

        it('2 issues', function () {
            let response = require('./test-data/sample-2-issues.json')
            let metrics = JiraUtil.processResponse(response);

            expect(metrics)
                .to.be.an('object')
                .that.has.nested.property('lead-time.average.weeks', 1).and.also
                .that.has.nested.property('lead-time.average.days', 1).and.also
                .that.has.nested.property('lead-time.average.hours', 5).and.also
                .that.has.nested.property('lead-time.average.minutes', 22).and.also
                .that.has.nested.property('lead-time.average.seconds', 12).and.also
                .that.has.nested.property('lead-time.average.duration.millis', 710532382).and.also
                .that.has.nested.property('lead-time.average.duration.seconds', 710532).and.also
                .that.has.nested.property('cycle-time.average.weeks', 0).and.also
                .that.has.nested.property('cycle-time.average.days', 4).and.also
                .that.has.nested.property('cycle-time.average.hours', 15).and.also
                .that.has.nested.property('cycle-time.average.minutes', 13).and.also
                .that.has.nested.property('cycle-time.average.seconds', 5).and.also
                .that.has.nested.property('cycle-time.average.duration.millis', 400385960).and.also
                .that.has.nested.property('cycle-time.average.duration.seconds', 400385);

        });

        it('3 issues', function () {
            let response = require('./test-data/sample-3-issues.json')
            let metrics = JiraUtil.processResponse(response);

            expect(metrics)
                .to.be.an('object')
                .that.has.nested.property('lead-time.average.weeks', 2).and.also
                .that.has.nested.property('lead-time.average.days', 5).and.also
                .that.has.nested.property('lead-time.average.hours', 10).and.also
                .that.has.nested.property('lead-time.average.minutes', 7).and.also
                .that.has.nested.property('lead-time.average.seconds', 7).and.also
                .that.has.nested.property('lead-time.average.duration.millis', 1678027279).and.also
                .that.has.nested.property('lead-time.average.duration.seconds', 1678027).and.also
                .that.has.nested.property('cycle-time.average.weeks', 1).and.also
                .that.has.nested.property('cycle-time.average.days', 0).and.also
                .that.has.nested.property('cycle-time.average.hours', 4).and.also
                .that.has.nested.property('cycle-time.average.minutes', 13).and.also
                .that.has.nested.property('cycle-time.average.seconds', 2).and.also
                .that.has.nested.property('cycle-time.average.duration.millis', 619982718).and.also
                .that.has.nested.property('cycle-time.average.duration.seconds', 619982);

        });
    });
});