class Keyboard {
    constructor() {
        this.keys = new Map();
        this.mappings = new Map();

        document.addEventListener("keydown", event => {
            this.handleEvent(event);
        });
    }
    
    addMapping(key, callback) {
        this.keys.set(key);
        this.mappings.set(key, callback);
    }

    handleEvent(event) {
        if (!this.mappings.has(event.key)) {
            return;
        }

        event.preventDefault();
        
        this.mappings.get(event.key)();
    }
    
    removeMapping(key) {
        return this.keys.delete(key) && this.mappings.delete(key);
    }

}