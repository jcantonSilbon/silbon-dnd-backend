// frontend/utils/api.js

export async function getBlocks() {
  const res = await fetch("/api/blocks");
  if (!res.ok) throw new Error("Error fetching blocks");
  return await res.json();
}

export async function createOrUpdateBlock(block) {
  const res = await fetch("/api/blocks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(block),
  });

  if (!res.ok) throw new Error("Error saving block");
  return await res.json();
}

export async function updateBlockById(_id, updatedData) {
  const res = await fetch(`/api/blocks/${_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Error updating block");
  return await res.json();
}

export async function deleteBlock(id) {
  const res = await fetch(`/api/blocks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}), // necesario aunque esté vacío
  });

  if (!res.ok) throw new Error("Error deleting block");
  return await res.json();
}
