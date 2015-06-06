
export default  function objectEntries(obj) {
        let index = 0;

        // In ES6, you can use strings or symbols as property keys,
        // Reflect.ownKeys() retrieves both
        let propKeys = Reflect.ownKeys(obj);

        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                if (index < propKeys.length) {
                    let key = propKeys[index];
                    index++;
                    return { value: [key, obj[key]] };
                } else {
                    return { done: true };
                }
            }
        };
    }