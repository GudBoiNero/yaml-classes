import { Notice, Plugin } from 'obsidian';
import { SettingTab, DEFAULT_SETTINGS, Settings } from './settings/Settings'
import EventHandler from './handlers/EventHandler';

export default class YamlClasses extends Plugin {
	settings: Settings;
	public eventHandler: EventHandler

	async onload() {
		await this.loadSettings();

		new Notice("Initate YamlClasses!");
		
		this.eventHandler = new EventHandler(this, this.settings)
		await this.eventHandler.setup()

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onUnload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
