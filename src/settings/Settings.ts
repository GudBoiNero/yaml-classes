import { App, PluginSettingTab, Setting } from 'obsidian';
import { FolderSuggest } from './suggestors/FolderSuggestor'
import YamlClasses from '../main'

export interface Settings {
	classesFolder: string;
	mySetting: string;
}

export const DEFAULT_SETTINGS: Settings = {
	mySetting: 'default',
	classesFolder: ''
}

export class SettingTab extends PluginSettingTab {
	plugin: YamlClasses;

	constructor(app: App, plugin: YamlClasses) {
		super(app, plugin);
		this.plugin = plugin;
        this.addTemplateFolderSetting();
	}

	display(): void {}

	addTemplateFolderSetting(): void {
        new Setting(this.containerEl)
            .setName("Classes folder location")
            .setDesc("Files in this folder will registered as a class. Notes where their `class` property is the same as the name of a file in this folder will have their properties reflected.")
            .addSearch((cb) => {
                new FolderSuggest(cb.inputEl);
                cb.setPlaceholder("Example: folder1/folder2")
                    .setValue(this.plugin.settings.classesFolder)
                    .onChange((new_folder) => {
                        this.plugin.settings.classesFolder = new_folder;
                        this.plugin.saveSettings();
                    });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            });
    }
}