// Name: Turbo Bot
// ID: TurboBotAI
// Description: Advanced AI text and image generation with bot memory.
// By: Seigh_sword <https://scratch.mit.edu/users/Seigh-sword/>
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
        id: "TurboBotAI",
        name: Scratch.translate("Turbo Bot"),
        sampleURL:
          "https://turbowarp.org/editor?project_url=https://extensions.turbowarp.org/samples/Turbobot_sample.sb3",
        docsURI: "https://docs.turbowarp.org/extensions/Seigh-sword/turbobot",
        menuIconURI: icon,
        blockIconURI: icon,
        color1: blockColor,
        color2: menuColor,
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
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TurboBot",
              },
            },
          },
          {
            opcode: "renameBot",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("rename [NAME1] to [NAME2]"),
            arguments: {
              NAME1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TurboBot",
              },
              NAME2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TurboPal",
              },
            },
          },
          {
            opcode: "deleteBot",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("delete bot named [NAME]"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TurboBot",
              },
            },
          },
          {
            opcode: "exportBot",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("export bot [NAME] as [TYPE]"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TurboBot",
              },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "fileMenu" },
            },
          },
          {
            opcode: "importBot",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "import conversation [TEXT] as [TYPE] to bot [NAME]"
            ),
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "[]" },
              TYPE: { type: Scratch.ArgumentType.STRING, menu: "fileMenu" },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "TurboBot",
              },
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
            opcode: "setImageModel",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set image model [MOD]"),
            arguments: {
              MOD: { type: Scratch.ArgumentType.STRING, menu: "imageMenu" },
            },
          },
          "---",
          {
            opcode: "setImageSize",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set image gen height [H] and width [W]"),
            arguments: {
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 360 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 },
            },
          },
          {
            opcode: "getGenHeight",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("image gen height"),
          },
          {
            opcode: "getGenWidth",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("image gen width"),
          },
          "---",
          {
            opcode: "simplePrompt",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("prompt [TEXT]"),
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello!",
              },
            },
          },
          {
            opcode: "setCostumeFromPrompt",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set image from prompt [TEXT] as SVG costume named [NAME]"
            ),
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "racecar",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "costume2",
              },
            },
          },
          {
            opcode: "getImageUrl",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("get url for image prompt [TEXT]"),
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a racecar",
              },
            },
          },
          {
            opcode: "attachFile",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("attach file url [URL]"),
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
            },
          },
          "---",
          {
            opcode: "setContextText",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("set context [CTX] and prompt [TEXT]"),
            arguments: {
              CTX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Persona",
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello!",
              },
            },
          },
          {
            opcode: "setContextImageURL",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate(
              "set text context [CTX] and generate image url for [TEXT]"
            ),
            arguments: {
              CTX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Pixel Art",
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a dragon",
              },
            },
          },
          {
            opcode: "setContextImageCostume",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set text context [CTX] and generate image [TEXT] as costume named [NAME]"
            ),
            arguments: {
              CTX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Cyberpunk",
              },
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "a car",
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "AI_Costume",
              },
            },
          },
          "---",
          {
            opcode: "setSystem",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set system log [LOG]"),
            arguments: {
              LOG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "You are a helpful assistant.",
              },
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
          {
            opcode: "setSeed",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set seed [N]"),
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12345 },
            },
          },
          {
            opcode: "getSeed",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("seed"),
          },
          {
            opcode: "getTemp",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("temperature"),
          },
        ],
        menus: {
          textMenu: {
            acceptReporters: true,
            items: [
              "openai",
              "mistral",
              "gemini",
              "deepseek-r1",
              "p1",
              "llama",
            ],
          },
          imageMenu: {
            acceptReporters: true,
            items: [
              "turbo",
              "flux-pro",
              "flux-realism",
              "flux-anime",
              "flux-3d",
              "flux",
              "any",
            ],
          },
          fileMenu: {
            acceptReporters: true,
            items: ["json", "text", "markdown", "csv", "html"],
          },
        },
      };
    }

    isReady() {
      return true;
    }
    isThinking() {
      return this.isFetching;
    }
    getCurrentModel() {
      return `T:${this.textModel} | I:${this.imageModel}`;
    }
    getBotName() {
      return Object.keys(this.bots)[0] || "None";
    }
    getMemory() {
      return JSON.stringify(this.bots);
    }
    getSeed() {
      return this.seed;
    }
    getTemp() {
      return this.temp;
    }
    getGenHeight() {
      return this.genHeight;
    }
    getGenWidth() {
      return this.genWidth;
    }

    createBot({ NAME }) {
      if (!this.bots[NAME]) this.bots[NAME] = [];
    }
    renameBot({ NAME1, NAME2 }) {
      if (this.bots[NAME1] && !this.bots[NAME2]) {
        this.bots[NAME2] = this.bots[NAME1];
        delete this.bots[NAME1];
      }
    }
    deleteBot({ NAME }) {
      delete this.bots[NAME];
    }
    setTextModel({ MOD }) {
      this.textModel = MOD;
    }
    setImageModel({ MOD }) {
      this.imageModel = MOD;
    }
    setTemp({ N }) {
      this.temp = N;
    }
    setSeed({ N }) {
      this.seed = N;
    }
    setSystem({ LOG }) {
      this.systemLog = LOG;
    }
    attachFile({ URL }) {
      this.attachedFile = URL;
    }
    setImageSize({ H, W }) {
      this.genHeight = H;
      this.genWidth = W;
    }

    importBot({ TEXT, TYPE, NAME }) {
      if (!this.bots[NAME]) this.bots[NAME] = [];
      try {
        if (TYPE === "json") {
          const data = JSON.parse(TEXT);
          if (Array.isArray(data)) this.bots[NAME] = data;
        } else {
          this.bots[NAME].push({ q: "Imported Data", a: TEXT });
        }
      } catch (err) {
        console.error("Import failed");
      }
    }

    exportBot({ NAME, TYPE }) {
      const history = this.bots[NAME];
      if (!history || history.length === 0) return "";
      if (TYPE === "json") return JSON.stringify(history);
      if (TYPE === "text")
        return history.map((h) => `User: ${h.q}\nBot: ${h.a}`).join("\n\n");
      if (TYPE === "markdown")
        return history
          .map((h) => `### User\n${h.q}\n\n### Bot\n${h.a}`)
          .join("\n\n---\n\n");
      if (TYPE === "csv")
        return (
          "Question,Answer\n" +
          history
            .map(
              (h) => `"${h.q.replace(/"/g, '""')}","${h.a.replace(/"/g, '""')}"`
            )
            .join("\n")
        );
      if (TYPE === "html")
        return `<html><body>${history.map((h) => `<p><b>User:</b> ${h.q}</p><p><b>Bot:</b> ${h.a}</p><hr>`).join("")}</body></html>`;
      return "";
    }

    async simplePrompt({ TEXT }) {
      if (!TEXT || TEXT.trim() === "") return "";
      const now = Date.now();
      if (now - this.lastTextTime < this.textCooldown)
        return "Cooldown active (1s).";
      this.lastTextTime = now;

      this.isFetching = true;
      try {
        const fullSystem = this.systemLog + this.safetyGuard;
        const url = `https://text.pollinations.ai/${encodeURIComponent(TEXT)}?model=${this.textModel}&system=${encodeURIComponent(fullSystem)}&seed=${this.seed}&temperature=${this.temp}`;
        const r = await Scratch.fetch(url);
        const res = await r.text();
        this.isFetching = false;
        if (res && res.trim() !== "") {
          const botNames = Object.keys(this.bots);
          if (botNames.length > 0)
            this.bots[botNames[0]].push({ q: TEXT, a: res });
        }
        return res;
      } catch (e) {
        this.isFetching = false;
        return "Error";
      }
    }

    async setContextText({ CTX, TEXT }) {
      return await this.simplePrompt({ TEXT: `[Context: ${CTX}] ${TEXT}` });
    }

    _buildImageUrl(ctx, text) {
      if (!text || text.trim() === "") return "";
      const fullPrompt = ctx ? `${ctx}, ${text}` : text;
      let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?model=${this.imageModel}&seed=${this.seed}&width=${this.genWidth}&height=${this.genHeight}&nologo=true`;
      if (this.attachedFile)
        url += `&feed=${encodeURIComponent(this.attachedFile)}`;
      return url;
    }

    setContextImageURL({ CTX, TEXT }) {
      return this._buildImageUrl(CTX, TEXT);
    }
    getImageUrl({ TEXT }) {
      return this._buildImageUrl("", TEXT);
    }

    async setContextImageCostume(args, util) {
      const url = this._buildImageUrl(args.CTX, args.TEXT);
      if (url === "") return;
      await this._handleCostumeGen(url, args.NAME, util);
    }

    async setCostumeFromPrompt(args, util) {
      const url = this._buildImageUrl("", args.TEXT);
      if (url === "") return;
      await this._handleCostumeGen(url, args.NAME, util);
    }

    async _handleCostumeGen(imageUrl, name, util) {
      const now = Date.now();
      if (now - this.lastImageTime < this.imageCooldown) {
        console.warn("Image cooldown active.");
        return;
      }

      this.isFetching = true;
      try {
        const response = await Scratch.fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        const oldIndex = util.target.getCostumeIndexByName(name);
        if (oldIndex !== -1) {
          util.target.deleteCostume(oldIndex);
        }

        const svgContent = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.genWidth}" height="${this.genHeight}" viewBox="0 0 ${this.genWidth} ${this.genHeight}"><image width="${this.genWidth}" height="${this.genHeight}" xlink:href="${dataUrl}"/></svg>`;
        const storage = util.runtime.storage;
        const asset = await storage.createAsset(
          storage.AssetType.ImageVector,
          storage.DataFormat.SVG,
          new TextEncoder().encode(svgContent),
          null,
          true
        );
        const costume = {
          name: name,
          asset: asset,
          md5: asset.assetId + ".svg",
          assetId: asset.assetId,
          dataFormat: "svg",
          rotationCenterX: this.genWidth / 2,
          rotationCenterY: this.genHeight / 2,
        };

        util.target.addCostume(costume);
        util.target.setCostume(util.target.getCostumeIndexByName(name));

        this.lastImageTime = Date.now();
        this.isFetching = false;
      } catch (e) {
        this.isFetching = false;
        console.error("Costume gen failed", e);
      }
    }
  }

  Scratch.extensions.register(new TurboBot());
})(Scratch);
