import { Notice } from "obsidian";
import { parse } from "yaml";

export interface PropPair<K, V> { key: K, value: V}
export interface PropObject {
    arrays:  Array<PropPair<string, Array<PropObject>[] | string[] | number[]>>;
    objects: Array<PropPair<string, PropObject>>;
    strings: Array<PropPair<string, string>>;
    numbers: Array<PropPair<string, number>>;
}

export default class YamlParser {
    public static parseFromString(data: string): PropObject {
        let yaml: PropObject = {
            arrays: [],
            objects: [],
            strings: [],
            numbers: []
        };
        
        const sep: string = this.separateFromString(data)
        const obj: object = parse(sep)

        const mapToYamlObject = (yamlObj: PropObject, entries: [string, any][]): PropObject => {
            for (const [key, value] of entries) {
                switch (typeof(value)) {
                    case "string": {
                        yamlObj.strings.push({ key, value })
                    } break; 
                    case "number": {
                        yamlObj.numbers.push({ key, value })
                    } break;
                    case "object": {
                        if (Array.isArray(value)) {
                            const arr: any[] = []
                            value.forEach(v => {
                                switch(typeof(v)) {
                                    case "string": {
                                        arr.push(v)
                                    } break;
                                    case "number": {
                                        arr.push(v)
                                    } break;
                                    case "object": {
                                        if (Array.isArray(v)) {
                                            // Implement
                                        } else {
                                            arr.push(mapToYamlObject({arrays: [], numbers: [], objects: [], strings: []} as PropObject, Object.entries(v)))
                                        }
                                    } break;
                                }
                            })
                            yamlObj.arrays.push({key, value: arr})
                        } else {
                            yamlObj.objects.push({key: key, value: mapToYamlObject(yamlObj, Object.entries(value))})
                        }
                    } break;
                }
            }
            return yamlObj;
        }
        mapToYamlObject(yaml, Object.entries(obj))

        console.log("" + JSON.stringify(yaml))

        return yaml;
    }

    /**
     * Parses an entire file and finds the text surrounded by three dashes
     * Then it parses it into a json file
     */
    public static separateFromString(data: string): string {
        let str: string = data; 
        str = new RegExp(/(?<=\-\-\-\n)[\s\S]+(?=\-\-\-)/).exec(str)?.[0] ?? str
        return str;
    }
}