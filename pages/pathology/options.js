const optionsName = "PathologyOptions";

const MoveMethods = Object.freeze({
    Tap: 0,
    Swipe: 1,
    Drag: 2,
})

// hmm
class PathologyOptions {
    static fillWalls = true;
    static outlineGrid = false;
    static moveMethod = MoveMethods.Tap;
}

class IOptions { // bad name atm cuz bad implementation
    static forwardBinds = [];

    static assertProperty(propertyName) {
        if (PathologyOptions[propertyName] === undefined) {
            throw new Error(`${propertyName} is not an option.`);
        }
    }

    // me when i don't use a framework so i end up making my own
    // not entirely sure if there can be a (to the clock cycle tbf) race condition here
    static bindToggle(toggle, propertyName) {
        this.assertProperty(propertyName);
        toggle.addEventListener('click', () => {
            this.setProperty(propertyName, toggle.checked);
        });
        this.forwardBinds.push(() => toggle.checked = PathologyOptions[propertyName]);
        // sync immediately
        toggle.checked = PathologyOptions[propertyName];
    }

    static updateBinds() {
        this.forwardBinds.forEach(setter => setter());
    }

    static setProperty(propertyName, value) {
        // check property exists and has same type as being set
        this.assertProperty(propertyName);
        if (typeof PathologyOptions[propertyName] !== typeof value) {
            throw new Error(`${propertyName} has type ${typeof PathologyOptions[propertyName]} but tried to be set to type ${typeof value}`);
        }
        // actually set the property (i forgot this for a while)
        PathologyOptions[propertyName] = value;
        // somewhat redundant for if the element changing calls this but guarantees sync
        this.updateBinds();
        // update cookie
        this.setOptions();
    }

    static setOptionsFromString(data) {
        for (let pair of data.split('|')) {
            if (!pair.includes(':')) {continue}
            const [property, value] = pair.split(':');
            this.assertProperty(property);
            PathologyOptions[property] = JSON.parse(value);
        }
        this.updateBinds();
    }

    static serialise() {
        // considering this is a static site managed only by me, no encoding atm and very basic serde
        let s = "";
        for (let property in PathologyOptions) {
            s += `${property}:${PathologyOptions[property]}|`;
        }
        return s;
    }

    static async getOptions() {
        let optionsCookie = await cookieStore.get(optionsName);
        if (optionsCookie) {
            this.setOptionsFromString(decodeURIComponent(optionsCookie.value));
        }
    }
    
    static async setOptions() {
        try {
            await cookieStore.set(optionsName, encodeURIComponent(this.serialise()));
        } catch (error) {
            console.log(`Set options cookie failed: ${error}`);
        }
    }
}

IOptions.getOptions();