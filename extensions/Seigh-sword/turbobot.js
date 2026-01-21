// Name: Turbo Bot
// ID: TurboBotAI
// Description: Advanced AI text and image generation with bot memory.
// By: Seigh_sword <https://scratch.mit.edu/users/Seigh-sword/>, also join the discord <https://discord.com/invite/QnJXQw2gJE>
// License: MPL-2.0
// @turbowarp-extension
// @unsandboxed

//     _________  ___  ___  ________  ________  ________  ________  ________  _________        ________  ___
//    |\___   ___\\  \|\  \|\   __  \|\   __  \|\   __  \|\   __  \|\   __  \|\___   ___\     |\   __  \|\  \
//    \|___ \  \_\ \  \\\  \ \  \|\  \ \  \|\ /\ \  \|\  \ \  \|\ /\ \  \|\  \|___ \  \_|     \ \  \|\  \ \  \
//         \ \  \ \ \  \\\  \ \   _  _\ \   __  \ \  \\\  \ \   __  \ \  \\\  \   \ \  \       \ \   __  \ \  \
//          \ \  \ \ \  \\\  \ \  \\  \\ \  \|\  \ \  \\\  \ \  \|\  \ \  \\\  \   \ \  \       \ \  \ \  \ \  \
//           \ \__\ \ \_______\ \__\\ _\\ \_______\ \_______\ \_______\ \_______\   \ \__\       \ \__\ \__\ \__\
//            \|__|  \|_______|\|__|\|__|\|_______|\|_______|\|_______|\|_______|    \|__|        \|__|\|__|\|__|

(function (Scratch) {
  "use strict";

  //PRIVACY & SECURITY NOTE:
  // This extension only needs unsandboxed mode Only to allow the AI to upload generated image into users sprite's costumes
  // but Sandboxed exetensions are not allowed to access TurboWarp's asset system or service. and that is the reason for
  // making this extension only run on unsandboxed mode, other wise this won't work so, turbowarp devs keep taht in mind

  if (!Scratch.extensions.unsandboxed) {
    throw new Error(
      "Turbo Bot must run unsandboxed as its made unsandoxed, becuase of a block for importing the image gen by AI to the costume editor"
    );
  }

  const icon =
    "https://raw.githubusercontent.com/Seigh-sword/TurboBot-Turbwarp/refs/heads/main/assets/TurboBotIcon.png";
  const blockColor = "#FF4C4C";
  const menuColor = "#B00000";

  class TurboBot {
    constructor() {
      this.bots = {};
      this.textModel = "openai";
      this.imageModel = "turbo";
      this.temp = 1;
      this.seed = Math.floor(Math.random() * 999999);
      this.systemLog = "You are a helpful assistant.";
      this.attachedFile = "";
      this.isFetching = false;
      this.genWidth = 480;
      this.genHeight = 360;

      this.lastTextTime = 0;
      this.lastImageTime = 0;
      this.textCooldown = 1000;
      this.imageCooldown = 32000;

      this.safetyGuard =
        " | IMPORTANT: Always stay family-friendly and polite. If the user asks for anything inappropriate, decline politely.";
    }

    getInfo() {
      return {
        (function (Scratch) {
  "use strict";

 (function (Scratch) {
  "use strict";

  class TurboBot {
    constructor() {
      this.bots = {};
      this.textModel = "openai";
      this.imageModel = "turbo";
      this.seed = 12345;
      this.temp = 1.0;
      this.genHeight = 360;
      this.genWidth = 480;
      this.isFetching = false;
      this.systemLog = "You are a helpful assistant.";
      this.safetyGuard = " (Family-friendly mode active)";
      this.lastTextTime = 0;
      this.textCooldown = 1000;
      this.lastImageTime = 0;
      this.imageCooldown = 5000;
      this.attachedFile = "";
      this.maxTokens = 250; 
    }

    getInfo() {
      return {
        id: "TurboBotAI",
        name: Scratch.translate("Turbo Bot"),
        docsURI: "https://github.com/Seigh-sword/TurboBot-Turbwarp?tab=readme-ov-file#turbobot",
        blocks: [
          {
            opcode: "isReady",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("AI ready?"),
          },
          {
            opcode: "isThinking",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("is bot thinking?"),
          },
          {
            opcode: "getCurrentModel",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("model?"),
          },
          {
            opcode: "getBotName",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("bot?"),
          },
          {
            opcode: "getMemory",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("memory"),
          },
          "---",
          {
            opcode: "createBot",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("create bot named [NAME]"),
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "TurboBot" },
            },
          },
          {
            opcode: "renameBot",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("rename [NAME1] to [NAME2]"),
            arguments: {
              NAME1: { type: Scratch.ArgumentType.STRING, defaultValue: "TurboBot" },
              NAME2: { type: Scratch.ArgumentType.STRING, defaultValue: "TurboPal" },
            },
          },
          {
            opcode: "deleteBot",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete bot named [NAME]"),
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "TurboBot" },
            },
          },
          "---",
          {
            opcode: "setTextModel",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set text model [MOD]"),
            arguments: {
              MOD: { type: Scratch.ArgumentType.STRING, menu: "textMenu" },
            },
          },
          {
            opcode: "setMaxTokens",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set max tokens to [N]"),
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 256 },
            },
          },
          {
            opcode: "getMaxTokens",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("max tokens"),
          },
          "---",
          {
            opcode: "simplePrompt",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("prompt [TEXT]"),
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello!" },
            },
          },
          {
            opcode: "setSystem",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set system log [LOG]"),
            arguments: {
              LOG: { type: Scratch.ArgumentType.STRING, defaultValue: "You are a helpful assistant." },
            },
          },
          {
            opcode: "setTemp",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set temperature [N]"),
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.0 },
            },
          },
        ],
        menus: {
          textMenu: {
            acceptReporters: true,
            items: ["openai", "mistral", "gemini", "deepseek-r1", "p1", "llama"],
          }
        },
      };
    }

    setMaxTokens({ N }) { this.maxTokens = N; }
    getMaxTokens() { return this.maxTokens; }

    async simplePrompt({ TEXT }) {
      if (!TEXT || TEXT.trim() === "") return "";
      const now = Date.now();
      if (now - this.lastTextTime < this.textCooldown) return "Cooldown!";
      this.lastTextTime = now;

      this.isFetching = true;
      try {
        const fullSystem = this.systemLog + this.safetyGuard;
        const url = `https://text.pollinations.ai/${encodeURIComponent(TEXT)}?model=${this.textModel}&system=${encodeURIComponent(fullSystem)}&seed=${this.seed}&temperature=${this.temp}&max_tokens=${this.maxTokens}`;
        
        const r = await Scratch.fetch(url);
        const res = await r.text();
        this.isFetching = false;
        return res;
      } catch (e) {
        this.isFetching = false;
        return "Error";
      }
    }

    isReady() { return true; }
    isThinking() { return this.isFetching; }
    getCurrentModel() { return `Model: ${this.textModel}`; }
    getBotName() { return Object.keys(this.bots)[0] || "None"; }
    getMemory() { return JSON.stringify(this.bots); }
    createBot({ NAME }) { if (!this.bots[NAME]) this.bots[NAME] = []; }
    renameBot({ NAME1, NAME2 }) {
      if (this.bots[NAME1] && !this.bots[NAME2]) {
        this.bots[NAME2] = this.bots[NAME1];
        delete this.bots[NAME1];
      }
    }
    deleteBot({ NAME }) { delete this.bots[NAME]; }
    setTextModel({ MOD }) { this.textModel = MOD; }
    setSystem({ LOG }) { this.systemLog = LOG; }
    setTemp({ N }) { this.temp = N; }
  }

  Scratch.extensions.register(new TurboBot());
})(Scratch);
