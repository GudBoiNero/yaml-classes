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
        this.plugin.registerEvent(this.plugin.app.vault.on("modify", async (file: TFile) => {
            new Notice(`modify Event: ${file.name}`)
            // anytime a `settings.classes_folder` file is changed, 
            // go through all files and refactor their `class` variable if it was the same as the files previous title
            if (file.parent?.path == this.settings.classes_folder) {
                this.plugin.app.vault.getFiles().forEach(async (classFile: TFile) => {
                    const yaml = await YamlParser.parseFromFile(classFile)

                    // If the file has the `class` property
                    const className = yaml?.strings.filter((pair) => pair.key != 'class')?.at(-1)
                    if (className) {
                        this.updateClassProperties(file, classFile)
                    }
                });
            }
        }));
    }

    updateClassProperties(file: TFile, class_file: TFile): void {
        new Notice(`Updating: ${file.name} to class ${class_file.name}`)
    }
}