import { useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import { getBlocks, deleteBlock } from "./utils/api"; // ajusta si está en otro sitio

export default function Routes() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const data = await getBlocks();
      setBlocks(data);
    };
    fetchBlocks();
  }, []);

  const handleUpdateBlock = (updatedBlock) => {
    setBlocks((prev) =>
      prev.map((block) => (block._id === updatedBlock._id ? updatedBlock : block))
    );
  };

  const handleDeleteBlock = async (id) => {
    try {
      await deleteBlock(id);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting block:", err);
    }
  };

  return (
    <>
      <Toolbar setBlocks={setBlocks} />
      <Canvas blocks={blocks} onUpdateBlock={handleUpdateBlock} onDeleteBlock={handleDeleteBlock} />
    </>
  );
}
