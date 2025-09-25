import mitt from "mitt";
import { AICard } from "./store";

type Events = {
  "cards:upsert": AICard;
  "cards:delete": { id: string };
  "connected": void;
  "disconnected": void;
};
const bus = mitt<Events>();

export type RealtimeDB = {
  subscribeCards(cb: (c: AICard) => void, onDelete: (id:string)=>void): () => void;
  upsertCard(c: AICard): Promise<void>;
  deleteCard(id: string): Promise<void>;
};

// ---- Mock realtime in-memory (เสียบจริงค่อยเปลี่ยน)
const mem = new Map<string, AICard>();

export const MockRealtime: RealtimeDB = {
  subscribeCards(cb, onDelete) {
    bus.on("cards:upsert", cb);
    bus.on("cards:delete", ({id}) => onDelete(id));
    // replay existing
    queueMicrotask(() => { mem.forEach(v => cb(v)); });
    return () => {
      bus.off("cards:upsert", cb as any);
      bus.off("cards:delete", onDelete as any);
    };
  },
  async upsertCard(c) {
    mem.set(c.id, c);
    bus.emit("cards:upsert", c);
  },
  async deleteCard(id) {
    mem.delete(id);
    bus.emit("cards:delete", { id });
  },
};