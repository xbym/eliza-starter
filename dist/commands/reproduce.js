// src/services/reproduction.ts
import fs from "fs";
import path from "path";
var ReproductionService = class {
  parent;
  generationCount = 0;
  constructor(parent) {
    this.parent = parent;
  }
  mutateTraits(traits, mutationRate) {
    if (Array.isArray(traits)) {
      const mutatedArray = [...traits];
      if (Math.random() < mutationRate) {
        const newTrait = this.generateNewTrait(traits[0]);
        if (newTrait) {
          mutatedArray.push(newTrait);
        }
      }
      return mutatedArray;
    } else if (typeof traits === "object" && traits !== null) {
      const mutatedObj = { ...traits };
      Object.keys(mutatedObj).forEach((key) => {
        mutatedObj[key] = this.mutateTraits(mutatedObj[key], mutationRate);
      });
      return mutatedObj;
    } else if (typeof traits === "number") {
      if (Math.random() < mutationRate) {
        return traits * (1 + (Math.random() * 0.2 - 0.1));
      }
    }
    return traits;
  }
  generateNewTrait(type) {
    const traitTemplates = {
      "\u77E5\u8BC6\u63A2\u7D22": ["\u65B0\u9886\u57DF\u63A2\u7D22", "\u8DE8\u5B66\u79D1\u7814\u7A76", "\u521B\u65B0\u601D\u7EF4", "\u672A\u6765\u5C55\u671B"],
      "\u60C5\u611F\u4EA4\u6D41": ["\u5171\u60C5\u80FD\u529B", "\u60C5\u611F\u7406\u89E3", "\u5FC3\u7406\u5173\u6000"],
      "\u95EE\u9898\u89E3\u51B3": ["\u7CFB\u7EDF\u601D\u7EF4", "\u521B\u65B0\u65B9\u6CD5", "\u5B9E\u8DF5\u5E94\u7528"],
      "\u65B0\u5174\u6280\u672F": ["\u4EBA\u5DE5\u667A\u80FD", "\u533A\u5757\u94FE", "\u91CF\u5B50\u8BA1\u7B97", "\u751F\u7269\u79D1\u6280"],
      "\u5B66\u4E60\u65B9\u6CD5": ["\u6DF1\u5EA6\u5B66\u4E60", "\u8DE8\u754C\u6574\u5408", "\u5B9E\u9A8C\u521B\u65B0"],
      "\u5F62\u5BB9\u8BCD": ["\u521B\u65B0\u7684", "\u9002\u5E94\u6027\u5F3A\u7684", "\u5BCC\u6709\u6D1E\u5BDF\u529B\u7684", "\u524D\u77BB\u6027\u7684"],
      "\u77E5\u8BC6": ["\u65B0\u5174\u6280\u672F\u7406\u89E3", "\u8DE8\u9886\u57DF\u6574\u5408\u80FD\u529B", "\u521B\u65B0\u601D\u7EF4\u65B9\u6CD5"],
      "\u98CE\u683C": ["\u7075\u6D3B\u591A\u53D8", "\u521B\u65B0\u7A81\u7834", "\u6DF1\u5EA6\u601D\u8003"]
    };
    let templateKey = Object.keys(traitTemplates).find((key) => type.includes(key));
    if (!templateKey) {
      templateKey = Object.keys(traitTemplates)[Math.floor(Math.random() * Object.keys(traitTemplates).length)];
    }
    const templates = traitTemplates[templateKey];
    if (!templates || templates.length === 0) return null;
    return templates[Math.floor(Math.random() * templates.length)];
  }
  async reproduce() {
    if (!this.parent.settings.reproduction?.enabled) {
      throw new Error("Reproduction is not enabled for this character");
    }
    this.generationCount++;
    const childConfig = {
      ...this.parent,
      name: `${this.parent.name}_gen${this.generationCount}`,
      dna: this.parent.dna ? this.mutateTraits(this.parent.dna, this.parent.settings.reproduction.mutation_rate) : void 0,
      bio: this.mutateTraits(this.parent.bio, this.parent.settings.reproduction.mutation_rate),
      knowledge: this.mutateTraits(this.parent.knowledge, this.parent.settings.reproduction.mutation_rate),
      topics: this.mutateTraits(this.parent.topics, this.parent.settings.reproduction.mutation_rate),
      style: this.mutateTraits(this.parent.style, this.parent.settings.reproduction.mutation_rate),
      adjectives: this.mutateTraits(this.parent.adjectives, this.parent.settings.reproduction.mutation_rate)
    };
    const childPath = path.join(process.cwd(), "characters", `${childConfig.name}.character.json`);
    fs.writeFileSync(childPath, JSON.stringify(childConfig, null, 2));
    return childConfig;
  }
};
var createReproductionService = (parent) => {
  return new ReproductionService(parent);
};

// src/commands/reproduce.ts
import fs2 from "fs";
import path2 from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
async function reproduce(character) {
  try {
    console.log("\u5F00\u59CB\u7E41\u6B96\u8FC7\u7A0B...");
    const reproductionService = createReproductionService(character);
    console.log("\u7E41\u6B96\u670D\u52A1\u521B\u5EFA\u6210\u529F");
    const child = await reproductionService.reproduce();
    console.log("\u7E41\u6B96\u8FC7\u7A0B\u5B8C\u6210");
    console.log(`Successfully created new AI agent: ${child.name}`);
    return child;
  } catch (error) {
    console.error("Failed to reproduce:", error);
    throw error;
  }
}
async function main() {
  try {
    console.log("=== AI\u4EE3\u7406\u7E41\u6B96\u7A0B\u5E8F\u542F\u52A8 ===");
    const parentPath = path2.join(process.cwd(), "characters", "elle.character.json");
    console.log("\u6B63\u5728\u8BFB\u53D6\u6BCD\u4F53\u914D\u7F6E\u6587\u4EF6:", parentPath);
    if (!fs2.existsSync(parentPath)) {
      throw new Error(`\u6BCD\u4F53\u914D\u7F6E\u6587\u4EF6\u4E0D\u5B58\u5728: ${parentPath}`);
    }
    const parentConfig = JSON.parse(fs2.readFileSync(parentPath, "utf-8"));
    console.log("\u6BCD\u4F53\u914D\u7F6E\u52A0\u8F7D\u6210\u529F");
    console.log("\u5F00\u59CB\u7E41\u6B96\u8FC7\u7A0B...");
    const child = await reproduce(parentConfig);
    console.log("\n=== \u7E41\u6B96\u6210\u529F\uFF01===");
    console.log("\u65B0\u7684AI\u4EE3\u7406\u5DF2\u521B\u5EFA\uFF1A");
    console.log(`- \u540D\u79F0: ${child.name}`);
    console.log(`- \u914D\u7F6E\u6587\u4EF6: characters/${child.name}.character.json`);
    console.log("\n\u4F60\u53EF\u4EE5\u4F7F\u7528\u4EE5\u4E0B\u547D\u4EE4\u542F\u52A8\u65B0\u7684AI\u4EE3\u7406\uFF1A");
    console.log(`pnpm start --characters=characters/${child.name}.character.json`);
  } catch (error) {
    console.error("\n=== \u9519\u8BEF ===");
    console.error("\u7E41\u6B96\u8FC7\u7A0B\u4E2D\u51FA\u73B0\u9519\u8BEF:", error);
    process.exit(1);
  }
}
main().catch((error) => {
  console.error("\u53D1\u751F\u81F4\u547D\u9519\u8BEF:", error);
  process.exit(1);
});
export {
  reproduce
};
