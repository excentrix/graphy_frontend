"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";

const DrawingBoard: React.FC = () => {
  const [stageWidth, setStageWidth] = useState<number>(0);
  const [stageHeight, setStageHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStageWidth(window.innerWidth);
      setStageHeight(window.innerHeight);
    }
  }, []);

  const [shapes, setShapes] = useState([
    {
      id: "rect1",
      type: "rect",
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: "blue",
    },
    {
      id: "circle1",
      type: "circle",
      x: 300,
      y: 200,
      radius: 50,
      fill: "yellow",
    },
  ]);

  const handleDragEnd = (e: any, id: string) => {
    const newShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return {
          ...shape,
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return shape;
    });
    setShapes(newShapes);
  };

  return (
    <div className="drawing-board-container border-2 w-4/5 h-[60vh] mt-5">
      {stageWidth > 0 && stageHeight > 0 && (
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Text text="Drag the shapes!" fontSize={15} />
            {shapes.map((shape) =>
              shape.type === "rect" ? (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, shape.id)}
                />
              ) : (
                <Circle
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.fill}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, shape.id)}
                />
              )
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default DrawingBoard;
