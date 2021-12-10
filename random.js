class Random {
    candidates = [];
    victims = []
    currentVictim = '';

    setVictims(victims) {
        this.victims = victims.split(',');
        console.log(this.victims)
    }

    setCandidates() {
        this.candidates = this.victims.filter((candidate) => {
            return this.currentVictim !== candidate
        })
    }

    setCurrentVictim(name) {
        if (name) {
            this.currentVictim = name;
            return name
        } else {
            const candidates = this.victims.length - 1;
            this.currentVictim = this.candidates[(Math.floor(Math.random() * candidates))] || 'Невідомо'
            return this.currentVictim || 'Oops :) ';
        }

    }

    printCandidates() {
        const percent = `${Math.floor(100 / this.candidates.length)}%`;
        let text;
        if (this.currentVictim) {
            text = this.currentVictim + ' ' + 0 + '%' + '\n'
        } else {
            text = ''
        }
        for (const candidate of this.candidates) {
            text += candidate.trim() + ' ' + percent + '\n'
        }
        return text
    }
}

module.exports.random = new Random();