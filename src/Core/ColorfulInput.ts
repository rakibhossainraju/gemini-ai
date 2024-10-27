import * as readline from 'node:readline';
import { stdin, stdout, exit } from 'node:process';


interface KeyType {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}

class ColorfulInput {
    private readonly colorCode: string;
    private inputText: string;
    constructor(colorCode = '\x1b[32m') { // Default to green
        this.colorCode = colorCode;
        this.inputText = '';
        this.setupInputListener();
    }

    private setupInputListener() {
        readline.emitKeypressEvents(stdin);
        stdin.setRawMode(true);

        stdin.on('keypress', (str: string, key: KeyType) => this.handleKeyPress(str, key));
    }

    private handleKeyPress(str: string, key: KeyType) {

        if (key && key.ctrl && key.name === 'c') {
            Deno.exit(0); // Deno equivalent
            // exit(); // Exit on Ctrl+C
        } else if(key && key.ctrl) {
          console.log(key);
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

    private newLine() {
        stdout.write('\n');
        this.inputText = ''; // Reset input after a new line
    }

    private backspace() {
        this.inputText = this.inputText.slice(0, -1);
    }

    private addCharacter(str: string) {
        this.inputText += str;
    }

    private updateDisplay() {
        stdout.write('\u001b[2K\u001b[0G'); // Clear current line
        stdout.write(`${this.colorCode}${this.inputText}\x1b[0m`); // Display text in chosen color
    }
}

// Instantiate the class with default color green or specify another color
new ColorfulInput(); // Default green
// Or pass a different color code, like '\x1b[31m' for red
