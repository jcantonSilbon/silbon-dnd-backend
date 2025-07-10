import { v4 as uuidv4 } from 'uuid';
import { createOrUpdateBlock } from '../utils/api';

export default function Toolbar({ setBlocks }) {
  const addBlock = async (type) => {
    const defaultContent = {
      text: 'Nuevo texto',
      image: 'https://via.placeholder.com/150',
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      button: 'Haz clic aquí',
    };

    const newBlock = {
      id: uuidv4(),
      type,
      content: defaultContent[type],
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
    };

    setBlocks((prev) => [...prev, newBlock]);
    try {
      await createOrUpdateBlock(newBlock);
    } catch (err) {
      console.error('❌ Error al guardar nuevo bloque:', err);
    }
  };

  return (
    <div className="toolbar">
      <button onClick={() => addBlock('text')}>Texto</button>
      <button onClick={() => addBlock('image')}>Imagen</button>
      <button onClick={() => addBlock('video')}>Vídeo</button>
      <button onClick={() => addBlock('button')}>Botón</button>
    </div>
  );
}
