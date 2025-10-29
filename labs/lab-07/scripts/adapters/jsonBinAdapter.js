//implement this file
// Persistent adapter (JsonBIN) load(), save(), reset(), snapshot()
// NOTE: In browser ES modules, file extensions are required
import { seedDoc } from "../model.js";
export class JsonBinAdapter {
    #binId;
    #root;
    #stampOnSave;
    #allowReset;
    constructor({ binId, root = "https://api.jsonbin.io/v3", stampOnSave = true, allowReset = false } = {}) {
        if (!binId) throw new Error("JsonBinAdapter:  'binId' is required");
        this.#binId = binId;
        this.#root = root.replace(/\/+$/, "");
        this.#stampOnSave = stampOnSave;
        this.#allowReset = allowReset;
        this.load = this.load.bind(this);
        this.save = this.save.bind(this);
        this.reset = this.reset.bind(this);
        this.snapshot = this.snapshot.bind(this);
    };
    #urlLatest() { return `${this.#root}/b/${this.#binId}/latest?meta=false`; }
    #urlBin() { return `${this.#root}/b/${this.#binId}`; }
    #stamp(d) {
        d.rev = (d.rev ?? 0) + 1;
        d.updatedAt = new Date().toISOString();
    }
    async #readLatest() {
        const res = await fetch(this.#urlLatest());
        if (!res.ok) throw new Error(`JSONBin read failed: ${res.status}`);
        return res.json();
    }
    async #write(next) {
        const res = await fetch(this.#urlBin(), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next)
        });
        if (!res.ok) throw new Error(`JSONBin write failed: ${res.status}`);
    }
    async load() {
        return await this.#readLatest();
    }
    // save w/ optimistic concurrency: compare remote.rev vs next.rev
    async save(next) {
        // fetch latest remote to avoid writing to stale data
        const remote = await this.#readLatest();
        const rRev = remote?.rev ?? 0;
        const nRev = next?.rev ?? 0;
        if (rRev > nRev) {
            // Someone wrote first, try again
            throw new Error("Remote newer, merge/reload before saving");
        }
        if (this.#stampOnSave) this.#stamp(next);
        await this.#write(next);
    }
    // Override the bin w/ a fresh seed
    async reset() {
        if (!this.#allowReset) {
            throw new Error("JsonBinAdapter.reset() disabled. Enable by setting {allowReset: true");
        }
        const fresh = seedDoc();
        if (this.#stampOnSave) this.#stamp(fresh);
        await this.#write(fresh);
    }
    async snapshot() {
        const doc = await this.#readLatest();
        // structuredClone may not exist for older engine, sub with JSON dance;
        return typeof structuredClone === "function" ? structuredClone(doc) : JSON.parse(JSON.stringify(doc));
    }
}
export function jsonBinAdapter(binId, opts = {}) {
    return new JsonBinAdapter({ binId, ...opts });
}