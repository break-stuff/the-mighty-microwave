interface IPresetOption {
    name: string;
    time: string;
}

class Presets {
    private presetStorageKey = 'preset-options';
    selectedPresetIndex = 0;
    options: IPresetOption[] = []; 

    constructor() {
        this.setPresets();
    }

    setPresets() {
        let options = JSON.parse(sessionStorage.getItem(this.presetStorageKey));
        this.options = options || [
            {
                name: 'Popcorn',
                time: '300'
            },
            {
                name: '',
                time: ''
            },
            {
                name: '',
                time: ''
            },
            {
                name: '',
                time: ''
            },
        ] as IPresetOption[];
    }

    updatePreset(index: number, name: string, time: string) {
        let preset = this.options[index];
        preset.name = name;
        preset.time = time;  
        this.savePresets();  
    }

    savePresets() {
        sessionStorage.setItem(this.presetStorageKey, JSON.stringify(this.options));
    }
}

let presets = new Presets();
export { presets };