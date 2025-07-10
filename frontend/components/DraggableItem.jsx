import React, { useRef, useState } from 'react';
import { updateBlockById, deleteBlock } from '../utils/api';

const DraggableItem = ({ block, onUpdate, onDelete }) => {
  const itemRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [content, setContent] = useState(block.content);
  const positionRef = useRef(block.position);
  const sizeRef = useRef(block.size);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = block.position.x;
    const initialY = block.position.y;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newPosition = {
        x: initialX + deltaX,
        y: initialY + deltaY,
      };

      positionRef.current = newPosition;
      onUpdate({ ...block, position: newPosition });
    };

    const onMouseUp = async () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      try {
        await updateBlockById(block.id, {
          position: positionRef.current,
          size: sizeRef.current,
        });
      } catch (err) {
        console.error('❌ Error guardando posición:', err);
      }
    };

    setDragging(true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleResize = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = block.size.width;
    const initialHeight = block.size.height;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newSize = {
        width: Math.max(50, initialWidth + deltaX),
        height: Math.max(30, initialHeight + deltaY),
      };

      sizeRef.current = newSize;
      onUpdate({ ...block, size: newSize });
    };

    const onMouseUp = async () => {
      setResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      try {
        await updateBlockById(block.id, {
          position: positionRef.current,
          size: sizeRef.current,
        });
      } catch (err) {
        console.error('❌ Error guardando tamaño:', err);
      }
    };

    setResizing(true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleBlur = async () => {
    try {
      await updateBlockById(block.id, { content });
    } catch (err) {
      console.error('❌ Error guardando contenido:', err);
    }
  };

  return (
    <div
      ref={itemRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: block.position.y,
        left: block.position.x,
        width: block.size.width,
        height: block.size.height,
        backgroundColor: '#fff',
        border: '1px solid #000',
        padding: '8px',
        cursor: dragging ? 'grabbing' : 'move',
        userSelect: 'none',
        boxShadow: dragging || resizing ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {block.type === 'text' && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            resize: 'none',
            fontSize: '14px',
            background: 'transparent',
            outline: 'none',
          }}
        />
      )}
      {block.type === 'image' && (
        <img
          src={block.content}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      )}
      {block.type === 'video' && (
        <video
          src={block.content}
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'auto',
            backgroundColor: '#000',
          }}
        />
      )}
      {block.type === 'button' && (
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #000',
            backgroundColor: '#e0e0e0',
            fontSize: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            outline: 'none',
          }}
        />
      )}

      <div
        className="resize-handle"
        onMouseDown={handleResize}
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          bottom: 0,
          right: 0,
          backgroundColor: '#000',
          cursor: 'se-resize',
        }}
      ></div>

      <button
        onClick={async () => {
          try {
            await deleteBlock(block.id);
            onDelete(block.id);
          } catch (err) {
            console.error('❌ Error al eliminar:', err);
          }
        }}
        style={{
          position: 'absolute',
          top: '-19px',
          right: '-16px',
          background: 'none',
          color: 'black',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '2rem',
          zIndex: 9999,
        }}
      >
        ×
      </button>
    </div>
  );
};

export default DraggableItem;
