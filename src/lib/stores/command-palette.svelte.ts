class CommandPaletteStore {
    #flagCommandPaletteVisibility: boolean = $state(false);

    isVisible() {
        return this.#flagCommandPaletteVisibility;
    }

    toggleVisibility() {
        this.#flagCommandPaletteVisibility = !this.#flagCommandPaletteVisibility;
        return this.#flagCommandPaletteVisibility;
    }
}

export const command_palette_store = new CommandPaletteStore;