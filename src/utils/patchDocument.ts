
export type PatchDocument = PatchOperation[];

export class PatchOperation {
    public op: string;
    public path: string;
    public value: any;

    constructor(op: string, path: string, value: any) {
        this.op = op;
        this.path = path;
        this.value = value;
    }
}


export const generatePatchDocument = (current: object, updates: object): PatchDocument => {
    const patchDocument = [];

    loopObjectEntries(patchDocument, current, updates);

    return patchDocument;
};

const loopObjectEntries = (patchDocument: any[], current: object, updates: object, prefix?: string) => {
    for (const [name, value] of Object.entries(updates)) {
        // if (moment.isMoment(value) && current[name] !== undefined && moment(current[name]).isSame(value, "day")) {
        //     continue;
        // }

        if (typeof value === "object" && !Array.isArray(value)) {
            loopObjectEntries(patchDocument, current[name], value, name);
            continue;
        }

        if (value !== undefined && current[name] !== value) {
            patchDocument.push(new PatchOperation("replace", prefix ? `${prefix}/${name}` : name, value))
        }
    }
};
