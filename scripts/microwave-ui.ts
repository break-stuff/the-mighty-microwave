import { microwave } from "./microwave";
import { presets } from "./presets";
import { playSound } from "./audio";
import { $, $$ } from "./dom-utils";

class MicrowaveUi {
    clockIntervalIds: any[] = [];
    $display = $('.display');
    $door = $('.door');
    images = [
        'https://cdn3-www.musicfeeds.com.au/assets/uploads/fun.gif',
        'https://media.giphy.com/media/3orieQUMobTxrgq7yo/giphy.gif',
        'https://images.techhive.com/images/article/2014/12/homer_simpsons_brain-580-100538110-orig.gif',
        'https://www.pbh2.com/wordpress/wp-content/uploads/2013/04/funniest-simpsons-gifs-homer-chili.gif',
        'https://media1.tenor.com/images/a9deab8308286186df3ffd20e1c7791f/tenor.gif'
    ];

    constructor() {
        this.setClockDisplay();
        this.displayPresets();
        this.initCustomEventListeners();
        this.controlPanelButtonClickHandler();
        this.startButtonClickHandler();
        this.add30ClickHandler();
        this.stopAndClearClickHandler();
        this.digitClickHandler();
        this.setPresetsUpdateHandler();
        this.presetFormSubmitHandler();
    }

    initCustomEventListeners() {
        document.addEventListener('done', () => {
            this.$door.classList.remove('running');
            playSound('bell');

            setTimeout(() => {
                microwave.state = microwave.states.ready;
                this.setClockDisplay();
                this.updateUiState();
            }, 1000);
        });

        document.addEventListener('count-down', () => this.$display.innerHTML = microwave.getFormattedTimerTime());
    }

    setTimerDisplay() {
        this.clearClockIntervals();
        this.$display.innerHTML = microwave.getFormattedTimerTime();
    }

    setRandomImage() {
        let imageIndex = Math.floor(Math.random() * 5) + 0;
        this.$door.style.backgroundImage = `url(${this.images[imageIndex]})`;
    }

    startMicrowave() {
        this.setRandomImage();
        this.clearClockIntervals();
        microwave.state = microwave.states.running;
        $('.door').classList.add('running');
        microwave.start();
        this.updateUiState();
    }

    displayPresets() {
        const that = this;
        $('.preset-controls').innerHTML = presets.options.map((x, index) => `<ks-button class="preset-control" display="hollow" color="light" data-time="${x.time}" data-index="${index}" size="sm">${x.name || 'Not Set'}</ks-button>`).join('');

        $$('.preset-control').forEach(x => x.on('click', function () {
            if (microwave.state === microwave.states.ready && this.dataset.time) {
                this.dataset.time.split('').forEach(x => microwave.addTimeToTimer(x));
                that.setTimerDisplay();
                that.startMicrowave();
            } else if (microwave.state === microwave.states.programming) {
                presets.selectedPresetIndex = parseInt(this.dataset.index);
                let preset = presets.options[presets.selectedPresetIndex];
                $<HTMLKsFormFieldElement>('#preset_text').value = preset.name;
                $<HTMLKsFormFieldElement>('#preset_time').value = preset.time;
                $<HTMLKsModalElement>('#preset_modal').show();
            }
        }));
    }

    updateUiState() {
        $('.screen-reader-message .state').innerHTML = microwave.state;
    }

    setClockDisplay() {
        this.$display.innerHTML = microwave.getTime();

        let clockIntervalId = setInterval(() => {
            this.$display.innerHTML = microwave.getTime();
        }, 1000);

        this.clockIntervalIds.push(clockIntervalId);
    }

    clearClockIntervals() {
        this.clockIntervalIds.forEach(x => clearInterval(x));
        this.clockIntervalIds = [];
    }

    controlPanelButtonClickHandler() {
        $$<HTMLKsButtonElement>('.control-panel ks-button').on('click', () => playSound('newBeep'));
    }

    startButtonClickHandler() {
        $('.start-button').on('click', () => {
            if (microwave.minutes <= 0 && microwave.seconds <= 0)
                return;

            this.startMicrowave();
        });
    }

    add30ClickHandler() {
        $('.add-30').on('click', () => {
            this.clearClockIntervals();
            microwave.add30SecondsToTimer();
            this.$display.innerHTML = microwave.getFormattedTimerTime();
        });
    }

    stopAndClearClickHandler() {
        $('.stop-clear').on('click', () => {
            this.$door.classList.remove('running');
            microwave.stopAndClear();
            this.updateUiState()

            if (microwave.state === microwave.states.ready)
                this.setClockDisplay();
        });
    }

    digitClickHandler() {
        $$('.digit').forEach(x => x.on('click', (e) => {
            if (microwave.state !== microwave.states.ready)
                return;

            microwave.addTimeToTimer(e.target.innerHTML);
            this.setTimerDisplay();
        }));
    }

    setPresetsUpdateHandler() {
        $('.set-presets').on('updated', (e) => {
            const $buttons = $$<HTMLKsButtonElement>('.control-panel ks-button');

            if (e.detail.value) {
                microwave.state = microwave.states.programming;
                this.updateUiState();
                $buttons.forEach(x => x.disabled = true);
                $$<HTMLKsButtonElement>('.preset-control').forEach(x => x.disabled = false);
            } else {
                microwave.state = microwave.states.ready;
                this.updateUiState();
                $buttons.forEach(x => x.disabled = false);
            }
        });
    }

    presetFormSubmitHandler() {
        $<HTMLKsFormElement>('#preset_form').on('submitted', (e) => {
            if (!e.detail.isValid)
                return;
        
            const formData = e.detail.formFieldData;
            presets.updatePreset(presets.selectedPresetIndex, formData[0].value, formData[1].value);
            this.displayPresets();
            $<HTMLKsModalElement>('#preset_modal').hide();
        });        
    }
}

const microwaveUi = new MicrowaveUi();
export { microwaveUi };