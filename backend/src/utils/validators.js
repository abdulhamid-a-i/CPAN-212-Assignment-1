


export function isCSV(filename) {
    return typeof filename === "string" && /\.[A-Za-z0-9]+$/.test(filename.trim());
}