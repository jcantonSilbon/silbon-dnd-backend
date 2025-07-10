// src/components/Canvas.jsx
import React from 'react';
import DraggableItem from './DraggableItem';

const Canvas = ({ blocks, onUpdateBlock, onDeleteBlock, canvasId  }) => {

    useEffect(() => {
    console.log("🧩 canvasId recibido:", canvasId);
    // Podrías usarlo para filtrar bloques por ID o lo que quieras
  }, [canvasId]);


  
  return (
    <div
      id="canvas" 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fafafa',
        border: '1px solid #ccc'
      }}
    >
      {blocks.map((block) => (
        <DraggableItem
          key={block.id}
          block={block}
          onUpdate={onUpdateBlock}
          onDelete={() => onDeleteBlock(block.id)} // 👈 Usamos el `id` personalizado, no el de Mongo
        />
      ))}
    </div>
  );
};

export default Canvas;
