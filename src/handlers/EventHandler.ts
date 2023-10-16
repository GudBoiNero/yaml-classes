import {
    EventRef,
    Notice,
    TFile
} from "obsidian";
import YamlParser from "src/core/util/YamlParser";
import YamlClasses from "src/main";
import { Settings } from "src/settings/Settings";

export default class EventHandler {
    constructor(
        private plugin: YamlClasses,
        private settings: Settings
    ) { }

    async setup(): Promise<void> {
        // anytime a file is opened, check its `class` property, and update it accordingly
        this.plugin.registerEvent(this.plugin.app.vault.on("modify", async (classFile: TFile) => {
            // anytime a `settings.classes_folder` file is changed, 
            // go through all files and refactor their `class` variable if it was the same as the files previous title
            if (classFile.parent?.path == this.settings.classesFolder) {
                this.plugin.app.vault.getFiles().forEach(async (file: TFile) => {
                    const data = await this.plugin.app.vault.read(file)
                    const yaml = YamlParser.parseFromString(data)
                    new Notice(JSON.stringify(yaml), 0)

                    // If the file has the `class` property
                    const className = yaml?.strings.filter((pair) => pair.key != 'class')?.at(-1)
                    if (className) {
                        this.updateClassProperties(file, classFile)
                    }
                });
            }
        }));
    }

    updateClassProperties(file: TFile, classFile: TFile): void {
        new Notice(`Updating: ${file.name} to class ${classFile.name}`)
    }
}