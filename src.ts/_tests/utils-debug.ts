function _inspectString(value: any, done: Set<any>): string {
    if (Array.isArray(value)) {
        return "[" + value.map((v) => _inspect(v, done)).join(", ") + "]";
    }

    switch (typeof(value)) {
        case "bigint":
            return value.toString() + "n";
        case "boolean":
        case "number":
        case "string":
            return JSON.stringify(value);
        case "symbol":
            return `[Symbol ${ String(value) }]`
        case "object": {
            if (value == null) { return "null"; }

            const keys = Object.keys(value);
            Object.getOwnPropertyNames(value).forEach((key) => {
                keys.push(key);
            });

            return "{ " + keys.map((key) => {
                return `${ key }=${ _inspect(value[key], done) }`;
            }).join(", ") + " }";
        }
    }

    return `[ unknown type: ${ value } ]`
}

function _inspect(value: any, done: Set<any>): string {
    if (done.has(value)) { return "[ Circular ]"; }

    done.add(value);
    const result = _inspectString(value, done);
    done.delete(value);

    return result;
}

export function inspect(value: any): string {
    return _inspect(value, new Set());
}
