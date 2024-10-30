import * as readline from "node:readline";
import { exit, stdin, stdout } from "node:process";
import AIModel from "./AIModel.ts";

interface KeyType {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}
type ResolveType = (value: string) => void;
type RejectType = (reason?: string) => void;

class ColorfulInput {
  private readonly colorCode: string;
  private inputText: string;
  private userInput: string;

  constructor(colorCode = "\x1b[32m") { // Default to green
    this.colorCode = colorCode;
    this.inputText = "";
    this.userInput = "";
    this.init();
  }

  private setupInputListener(resolve: ResolveType, reject: RejectType) {
    readline.emitKeypressEvents(stdin);
    stdin.setRawMode(true);

    stdin.on(
      "keypress",
      (str: string, key: KeyType) =>
        this.handleKeyPress(str, key, resolve, reject),
    );
  }

  private async init(){
        const aiModel = new AIModel();
    // const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    while (true) {
      const prompt = await this.getInputValue();
      const result = await aiModel.generateContentStream(prompt);
        for await (const chunk of result.stream) {
          await stdout.write(`${this.colorCode}${chunk.text()}\x1b[0m`);
        }
    }
  }

  public getInputValue(): Promise<string> {
    return new Promise((resolve: ResolveType, reject: RejectType) => {
      this.setupInputListener(resolve, reject);
    });
  }

  private handleKeyPress(
    str: string,
    key: KeyType,
    resolve: ResolveType,
    reject: RejectType,
  ) {
    if (key && (key.ctrl && key.name === "e")) {
      resolve(this.userInput);
      this.cleanup();
    }
    if (key && key.ctrl && key.name === "c") {
      reject("User pressed Ctrl+C");
      Deno.exit(0);
    }

    if (key.name === "return") {
      this.newLine();
    } else if (key.name === "backspace") {
      this.backspace();
    } else {
      this.addCharacter(str);
    }
    this.updateDisplay();
  }

  private newLine() {
    stdout.write("\n");
    this.inputText = ""; // Reset input after a new line
    this.userInput += "\n"; // Reset input after a new line
  }

  private backspace() {
    this.inputText = this.inputText.slice(0, -1);
    this.userInput = this.userInput.slice(0, -1);
  }

  private addCharacter(str: string) {
    this.inputText += str;
    this.userInput += str;
  }

  private updateDisplay() {
    stdout.write("\u001b[2K\u001b[0G"); // Clear current line
    stdout.write(`${this.colorCode}${this.inputText}\x1b[0m`); // Display text in chosen color
  }

  private cleanup() {
    // stdin.setRawMode(false);
    // stdin.removeAllListeners("keypress");
    this.inputText = "";
    this.userInput = "";
  }
}

const input = new ColorfulInput();

// Instantiate the class with default color green or specify another color
// new ColorfulInput(); // Default green
// Or pass a different color code, like '\x1b[31m' for red

export default ColorfulInput;
