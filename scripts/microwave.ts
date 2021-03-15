class Microwave {
    minutes: number = 0;
    seconds: number = 0;
    timerTime: string = '0000';
    timerTimeoutIds: any[] = [];
    countDownEvent = new CustomEvent('count-down');
    doneEvent = new CustomEvent('done');

    states = {
        running: 'running',
        paused: 'paused',
        ready: 'ready',
        programming: 'programming'
    };
    state = this.states.ready;

    start() {
        this.timerTime = '0000';
        this.state = this.states.running;
        this.updateTimerDisplay();
    }

    stopAndClear() {
        if (this.state === this.states.running) {
            this.state = this.states.paused;
            this.clearTimerTimeouts();
            return;
        }

        this.state = this.states.ready;
        this.timerTime = '0000';
        this.minutes = 0;
        this.seconds = 0;
    }

    getFormattedTimerTime() {
        let displayMinutes = this.minutes < 10 ? '0' + this.minutes : this.minutes.toString();
        let displaySeconds = this.seconds < 10 ? '0' + this.seconds : this.seconds.toString();
        return `${displayMinutes}:${displaySeconds}`;
    }

    decrementTimer() {
        this.seconds--;

        if (this.seconds < 0 && this.minutes > 0) {
            this.minutes--;
            this.seconds = 59;
        }
    }

    addTimeToTimer(digit: string) {
        if (!Number.isInteger(Number(digit)) || !this.timerTime.startsWith('0') || (this.timerTime === '0000' && this.minutes > 0 && this.seconds > 0))
            return;

        this.timerTime = (this.timerTime + digit).slice(1);
        this.minutes = Number(this.timerTime.slice(0, 2));
        this.seconds = Number(this.timerTime.slice(-2));
    }

    add30SecondsToTimer() {
        if ((this.minutes > 0 || this.seconds > 0) && this.state === this.states.paused)
            return;

        this.seconds += 30;

        if (this.seconds > 60) {
            this.minutes++;
            this.seconds -= 60;

            if (this.minutes > 99) {
                this.minutes = 99;
                this.seconds = 99;
            }
        }

        this.timerTime = this.getFormattedTimerTime().replace(':', '');
    }

    getTime() {
        return new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        }).replace(' AM', '').replace(' PM', '');
    }

    updateTimerDisplay() {
        document.dispatchEvent(this.countDownEvent);

        if (this.seconds <= 0 && this.minutes <= 0) {
            document.dispatchEvent(this.doneEvent);
            return;
        }

        this.timerCountdown();
    }

    timerCountdown() {
        let timerTimeoutId = setTimeout(() => {
            this.decrementTimer();
            this.updateTimerDisplay();
        }, 1000);

        this.timerTimeoutIds.push(timerTimeoutId);
    }

    clearTimerTimeouts() {
        this.timerTimeoutIds.forEach(x => clearTimeout(x));
        this.timerTimeoutIds = [];
    }
}

let microwave = new Microwave();
export { microwave };