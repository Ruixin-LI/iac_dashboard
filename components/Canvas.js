// components/Canvas.js
import { useDrop } from 'react-dnd';
import { useState } from 'react';

const Canvas = () => {
  const [items, setItems] = useState([]);

  const [, drop] = useDrop(() => ({
    accept: 'item',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      addItemToCanvas(item.id, left, top);
      return undefined;
    },
  }));

  const addItemToCanvas = (id, left, top) => {
    setItems((prevItems) => [...prevItems, { id, left, top }]);
  };

  return (
    <div ref={drop} style={{ width: '100%', height: '500px', position: 'relative', border: '1px solid black' }}>
      {items.map((item) => (
        <div key={item.id} style={{ position: 'absolute', left: item.left, top: item.top }}>
          {item.id}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
