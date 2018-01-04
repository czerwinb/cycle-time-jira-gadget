'use strict';

const chai = require('chai');
const chaiAlso = require('chai-also');
chai.use(chaiAlso);
const expect = chai.expect;

describe('DateUtils', () => {

    const DATE_A = new Date('2017-10-17T19:19:07.000+0000');
    const DATE_B = new Date('2017-11-09T09:58:30.966+0000');
    const MILLIS_BETWEEN_AB = 1953563966;

    const DateUtils = require('./date-utils')

    describe('#calculateMillisBetween()', () => {
        it('should throw an exception if any of passed arguments is not of type Date', () => {
            expect(() => {
                DateUtils.calculateMillisBetween(DATE_A, null);
            }).to.throw(TypeError, 'all arguments must be of type Date');

            expect(() => {
                DateUtils.calculateMillisBetween(null, DATE_A);
            }).to.throw(TypeError, 'all arguments must be of type Date');

            expect(() => {
                DateUtils.calculateMillisBetween(null, null);
            }).to.throw(TypeError, 'all arguments must be of type Date');
        });

        it('should return zero if there is no difference beteen dates', () => {
            let dateDiff = DateUtils.calculateMillisBetween(DATE_A, DATE_A);

            expect(dateDiff).to.be.equal(0);
        });

        it('should return difference between dates in millis', () => {
            let millisBetween = DateUtils.calculateMillisBetween(DATE_A, DATE_B);

            expect(millisBetween).to.be.equal(MILLIS_BETWEEN_AB);
        });
    });

    describe('#calculateDurationBetween()', () => {
        const SECONDS_BETWEEN_AB = 1953563;
        const DURATION_BETWEEN_AB_SECONDS = 23;
        const DURATION_BETWEEN_AB_MINUTES = 39;
        const DURATION_BETWEEN_AB_HOURS = 14;
        const DURATION_BETWEEN_AB_DAYS = 1;
        const DURATION_BETWEEN_AB_WEEKS = 3;

        it('should throw an exception if any of passed arguments is not of type Date', () => {
            expect(() => {
                DateUtils.calculateDurationBetween(DATE_A, null);
            }).to.throw(TypeError, 'all arguments must be of type Date');

            expect(() => {
                DateUtils.calculateDurationBetween(null, DATE_A);
            }).to.throw(TypeError, 'all arguments must be of type Date');

            expect(() => {
                DateUtils.calculateDurationBetween(null, null);
            }).to.throw(TypeError, 'all arguments must be of type Date');
        });

        it('should return duration object if there is no difference between dates', () => {
            let duration = DateUtils.calculateDurationBetween(DATE_A, DATE_A);

            expect(duration)
                .to.be.an('object')
                .that.has.property('weeks', 0).and.also
                .that.has.property('days', 0).and.also
                .that.has.property('hours', 0).and.also
                .that.has.property('minutes', 0).and.also
                .that.has.property('seconds', 0).and.also
                .that.has.nested.property('duration.millis', 0).and.also
                .that.has.nested.property('duration.seconds', 0);
        });

        it('should return duration object representing difference between dates', () => {
            let duration = DateUtils.calculateDurationBetween(DATE_A, DATE_B);

            expect(duration)
                .to.be.an('object')
                .that.has.property('weeks', DURATION_BETWEEN_AB_WEEKS).and.also
                .that.has.property('days', DURATION_BETWEEN_AB_DAYS).and.also
                .that.has.property('hours', DURATION_BETWEEN_AB_HOURS).and.also
                .that.has.property('minutes', DURATION_BETWEEN_AB_MINUTES).and.also
                .that.has.property('seconds', DURATION_BETWEEN_AB_SECONDS).and.also
                .that.has.nested.property('duration.millis', MILLIS_BETWEEN_AB).and.also
                .that.has.nested.property('duration.seconds', SECONDS_BETWEEN_AB);
        });
    });

    describe('#calculateDurationFor()', () => {
        const ZERO_TIME = 0;
        const NONZERO_TIME_IN_MILLIS = 1335840000;
        const NONZERO_TIME_IN_SECONDS = 1335840;
        const NONZERO_TIME_DURATION_SECONDS = 0;
        const NONZERO_TIME_DURATION_MINUTES = 4;
        const NONZERO_TIME_DURATION_HOURS = 11;
        const NONZERO_TIME_DURATION_DAYS = 1;
        const NONZERO_TIME_DURATION_WEEKS = 2;

        it('should return duration object for zero time', () => {
            let duration = DateUtils.calculateDurationFor(ZERO_TIME);

            expect(duration)
                .to.be.an('object')
                .that.has.property('weeks', 0).and.also
                .that.has.property('days', 0).and.also
                .that.has.property('hours', 0).and.also
                .that.has.property('minutes', 0).and.also
                .that.has.property('seconds', 0).and.also
                .that.has.nested.property('duration.millis', 0).and.also
                .that.has.nested.property('duration.seconds', 0);
        });

        it('should return duration object for zero time', () => {
            let duration = DateUtils.calculateDurationFor(NONZERO_TIME_IN_MILLIS);

            expect(duration)
                .to.be.an('object')
                .that.has.property('weeks', NONZERO_TIME_DURATION_WEEKS).and.also
                .that.has.property('days', NONZERO_TIME_DURATION_DAYS).and.also
                .that.has.property('hours', NONZERO_TIME_DURATION_HOURS).and.also
                .that.has.property('minutes', NONZERO_TIME_DURATION_MINUTES).and.also
                .that.has.property('seconds', NONZERO_TIME_DURATION_SECONDS).and.also
                .that.has.nested.property('duration.millis', NONZERO_TIME_IN_MILLIS).and.also
                .that.has.nested.property('duration.seconds', NONZERO_TIME_IN_SECONDS);
        });
    });
});