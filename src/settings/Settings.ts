import { App, PluginSettingTab, Setting } from 'obsidian';
import { FolderSuggest } from './suggestors/FolderSuggestor'
import YamlClasses from '../main'

export interface YamlClassesSettings {
	templates_folder: string;
	mySetting: string;
}

export const DEFAULT_SETTINGS: YamlClassesSettings = {
	mySetting: 'default',
	templates_folder: ''
}

export class Settings extends PluginSettingTab {
	plugin: YamlClasses;

	constructor(app: App, plugin: YamlClasses) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
        this.add_template_folder_setting();
	}

	add_template_folder_setting(): void {
        new Setting(this.containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addSearch((cb) => {
                new FolderSuggest(cb.inputEl);
                cb.setPlaceholder("Example: folder1/folder2")
                    .setValue(this.plugin.settings.templates_folder)
                    .onChange((new_folder) => {
                        this.plugin.settings.templates_folder = new_folder;
                        this.plugin.saveSettings();
                    });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            });
    }
}