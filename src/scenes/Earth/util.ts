

export function printArray(arr: any[], depth: number = 0): string {
    let result = '';
    const indent = '  '.repeat(depth);

    if (Array.isArray(arr)) {
        result += '[\n';
        arr.forEach((element, index) => {
            result += indent + '  ' + printArray(element, depth + 1);
            if (index < arr.length - 1) {
                result += ',\n';
            }
        });
        result += '\n' + indent + ']';
    } else {
        result += arr;
    }

    return result;
}