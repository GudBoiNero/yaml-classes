import { Notice, TFile, parseYaml } from "obsidian";

export interface YamlPair<K, V> { key: K, value: V}
export interface YamlObject extends Object {
    arrays:  Array<YamlPair<string, Array<any>>>;
    objects: Array<YamlPair<string, YamlObject>>;
    strings: Array<YamlPair<string, string>>;
    numbers: Array<YamlPair<string, number>>;
}

export default class YamlParser {
    public static async parseFromString(data: string): Promise<YamlObject | undefined> {
        let obj: YamlObject | undefined;

        new Notice(`Parsing:\n${JSON.stringify(parseYaml(data))}`, 0)

        return obj;
    }

    public static async parseFromFile(file: TFile): Promise<YamlObject | undefined> {
        return this.parseFromString(await app.vault.read(file));
    }
}