// web/api/blocks.js
import dbConnect from "~/lib/db";
import Block from "~/models/Block";
import { json } from "@remix-run/node";

export async function loader({ request }) {
  await dbConnect();
  const blocks = await Block.find();
  return json(blocks);
}

export async function action({ request }) {
  await dbConnect();
  const url = new URL(request.url);
  const method = request.method;
  const idFromParam = url.pathname.split("/").pop(); // para /api/blocks/:id

  const data = await request.json();

  try {
    if (method === "POST") {
      const { id, type, content, position, size } = data;

      let block = await Block.findOne({ id });

      if (block) {
        block.position = position;
        block.size = size;
        block.content = content;
        await block.save();
      } else {
        block = new Block({ id, type, content, position, size });
        await block.save();
      }

      return json({ success: true, block });
    }

    if (method === "PUT") {
      const update = {};
      if (data.position) update.position = data.position;
      if (data.size) update.size = data.size;
      if (data.content !== undefined) update.content = data.content;

      const updated = await Block.findByIdAndUpdate(idFromParam, update, {
        new: true,
      });

      if (!updated) return json({ error: "Block not found" }, { status: 404 });
      return json(updated);
    }

    if (method === "DELETE") {
      const deleted = await Block.findOneAndDelete({ id: idFromParam });
      if (!deleted) return json({ error: "Block not found" }, { status: 404 });
      return json({ success: true });
    }

    return json({ error: "Unsupported method" }, { status: 405 });
  } catch (err) {
    console.error("❌ API error:", err);
    return json({ error: "Server error" }, { status: 500 });
  }
}
