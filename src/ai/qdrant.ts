import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
  url: "http://qdrant:6333"
});

export async function ensureCollection(name: string) {
  const collections = await qdrant.getCollections();
  if (collections.collections.find(c => c.name === name)) return;

  await qdrant.createCollection(name, {
    vectors: { size: 384, distance: "Cosine" }
  });
}