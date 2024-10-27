const readline = require('readline');

class ColorfulInput {
    constructor(colorCode = '\x1b[32m') { // Default to green
        this.colorCode = colorCode;
        this.inputText = ''; // Initialize input text
        this.setupInputListener();
    }

    setupInputListener() {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (str, key) => this.handleKeyPress(str, key));
    }

    handleKeyPress(str, key) {
        if (key && key.ctrl && key.name === 'c') {
            process.exit(); // Exit on Ctrl+C
        }

        if (key.name === 'return') {
            this.newLine();
        } else if (key.name === 'backspace') {
            this.backspace();
        } else {
            this.addCharacter(str);
        }

        this.updateDisplay();
    }

    newLine() {
        process.stdout.write('\n');
        this.inputText = ''; // Reset input after a new line
    }

    backspace() {
        this.inputText = this.inputText.slice(0, -1);
    }

    addCharacter(str) {
        this.inputText += str;
    }

    updateDisplay() {
        process.stdout.write('\u001b[2K\u001b[0G'); // Clear current line
        process.stdout.write(`${this.colorCode}${this.inputText}\x1b[0m`); // Display text in chosen color
    }
}

// Instantiate the class with default color green or specify another color
const colorfulInput = new ColorfulInput(); // Default green
// Or pass a different color code, like '\x1b[31m' for red
