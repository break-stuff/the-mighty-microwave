import { microwave } from '../scripts/microwave';

describe('Microwave', () => {
    describe('getFormattedRemainingTime', () => {
        it('should prefix numbers less than "10" with "0"', () => {
            // Arrange
            microwave.minutes = 1;
            microwave.seconds = 5;

            // Act
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('01:05');
        });

        it('should not prefix numbers greater than "10" with "0"', () => {
            // Arrange
            microwave.minutes = 10;
            microwave.seconds = 50;

            // Act
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('10:50');
        });
    });


    describe('decrementTimer', () => {
        it('should go from "59" seconds to "58" seconds', () => {
            // Arrange
            microwave.minutes = 0;
            microwave.seconds = 59;

            // Act
            microwave.decrementTimer();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('00:58');
        });

        it('should go from "1" minute to "59" seconds', () => {
            // Arrange
            microwave.minutes = 1;
            microwave.seconds = 0;

            // Act
            microwave.decrementTimer();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('00:59');
        });
    });

    describe('addTimeToTimer', () => {
        it('should update time from "0000" to "0004"', () => {
            // Arrange
            // Act
            microwave.addTimeToTimer('4');

            // Assert
            expect(microwave.timerTime).toEqual('0004');
        });

        it('should update time from "0004" to "0048"', () => {
            // Arrange
            // Act
            microwave.addTimeToTimer('8');

            // Assert
            expect(microwave.timerTime).toEqual('0048');
        });

        it('should update time from "0048" to "4852" even though additional digits are added', () => {
            // Arrange
            // Act
            microwave.addTimeToTimer('5');
            microwave.addTimeToTimer('2');
            microwave.addTimeToTimer('6');
            microwave.addTimeToTimer('3');

            // Assert
            expect(microwave.timerTime).toEqual('4852');
        });

        it('should not add time if "timerTime" is "0000" and minutes or seconds are > 0', () => {
            // Arrange
            microwave.minutes = 2;
            microwave.timerTime = '0000';

            // Act
            microwave.addTimeToTimer('5');

            // Assert
            expect(microwave.timerTime).toEqual('0000');
        });
    });

    describe('add30SecondsToTimer', () => {
        it('should add 30 seconds to time', () => {
            // Arrange
            microwave.timerTime = '0102';
            microwave.minutes = 1;
            microwave.seconds = 2;
            microwave.state = microwave.states.ready;

            // Act
            microwave.add30SecondsToTimer();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('01:32');
        });

        it('should increase minute if seconds > 60', () => {
            // Arrange
            microwave.timerTime = '0045';
            microwave.minutes = 0;
            microwave.seconds = 45;
            microwave.state = microwave.states.ready;

            // Act
            microwave.add30SecondsToTimer();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('01:15');
        });

        it('should not add if time is set and state is "paused"', () => {
            // Arrange
            microwave.state = microwave.states.paused;

            // Act
            microwave.add30SecondsToTimer();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('01:15');
        });

        it('should add if time is set and state is "ready"', () => {
            // Arrange
            microwave.minutes = 0;
            microwave.seconds = 0;
            microwave.state = microwave.states.ready;

            // Act
            microwave.add30SecondsToTimer();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(formattedTime).toEqual('00:30');
        });
    });

    describe('stopAndClear', () => {
        it('should only set state to "paused" if state is "running" ', () => {
            // Arrange
            microwave.timerTime = '0102';
            microwave.minutes = 1;
            microwave.seconds = 2;
            microwave.state = microwave.states.running;

            // Act
            microwave.stopAndClear();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(microwave.state).toEqual(microwave.states.paused);
            expect(formattedTime).toEqual('01:02');
        });

        it('should reset time if state is "paused" and set state to "ready"', () => {
            // Arrange
            microwave.state = microwave.states.paused;

            // Act
            microwave.stopAndClear();
            let formattedTime = microwave.getFormattedTimerTime();

            // Assert
            expect(microwave.state).toEqual(microwave.states.ready);
            expect(microwave.timerTime).toEqual('0000');
            expect(formattedTime).toEqual('00:00');
        });
    });
});
