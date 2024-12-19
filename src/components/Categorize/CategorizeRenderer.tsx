import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useRendererStore } from "@/utils/RendererStore";

interface Category {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  category: string;
}

interface ICategorizeRenderer {
  item: {
    [key: string]: {
      categories: Category[];
      items: Item[];
      points: string;
      quesDesc: string;
    };
  };
}


export const CategorizeRenderer: React.FC<ICategorizeRenderer> = ({ item }) => {
  const questionsArray = Object.entries(item);

  const { setCategorizeData } = useRendererStore();

  const [state, setState] = useState(
    questionsArray.reduce((acc, [id, ques]) => {
      acc[id] = {
        sourceItems: ques.items.map(item => item.name),
        targetItems: [],
      };
      return acc;
    }, {} as Record<string, { sourceItems: string[]; targetItems: string[] }>)
  );

  console.log("state :", state);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If no destination or dropped outside
    if (!destination) return;

    const sourceQuestionId = source.droppableId.split("-")[0];

    // If the source and destination are the same
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setState((prevState) => {
      const newState = { ...prevState };
      const sourceItems = [...newState[sourceQuestionId].sourceItems];
      const targetItems = [...newState[sourceQuestionId].targetItems];

      if (source.droppableId.includes("sourceItems")) {
        const [moved] = sourceItems.splice(source.index, 1);
        if (destination.droppableId.includes("targetArea")) {
          targetItems.splice(destination.index, 0, moved);
        } else {
          sourceItems.splice(destination.index, 0, moved);
        }
      } else {
        const [moved] = targetItems.splice(source.index, 1);
        if (destination.droppableId.includes("sourceItems")) {
          sourceItems.splice(destination.index, 0, moved);
        } else {
          targetItems.splice(destination.index, 0, moved);
        }
      }

      newState[sourceQuestionId] = {
        sourceItems,
        targetItems,
      };

      const targetItemsWithMetadata = targetItems.map(itemName => {
        const originalItem = item[sourceQuestionId].items.find(i => i.name === itemName);
        return {
          id: originalItem?.id || '',
          name: itemName,
          category: originalItem?.category || ''
        };
      });

      setCategorizeData(sourceQuestionId, targetItemsWithMetadata);

      return newState;
    });
  };

  return (
    <div className="w-[50vw] flex flex-col gap-4">
      {questionsArray.map(([id, ques]) => (
        <div className="border border-gray-300 rounded-md p-4" key={id}>
          <div className="flex flex-col mb-4">
            <label className="font-medium">Question Description</label>
            {ques.quesDesc}
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-8 flex-col">
              {/* Source Items Column */}
              <div className="flex flex-col gap-2 items-center">
                <h3 className="font-medium">Items</h3>
                <Droppable droppableId={`${id}-sourceItems`}>
                  {(provided, snapshot) => (
                    <div
                      className="flex gap-2 flex-wrap border border-black/50 p-2 rounded-xl min-h-[50px]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "#e2e2e2"
                          : "transparent",
                      }}
                    >
                      {state[id]?.sourceItems.map((itm, i) => (
                        <Draggable
                          key={itm}
                          draggableId={`${id}-${itm}`}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="border border-black/50 rounded-xl p-1 px-2 flex bg-white"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.5 : 1,
                              }}
                            >
                              {itm}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <div className="flex gap-4 flex-1 justify-center">
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Categorize</label>
                  <div className="bg-yellow-400 rounded-xl w-[10rem] p-4 gap-2 flex flex-col">
                    {ques?.categories?.map((cat: Category, catIndex: number) => (
                      <div
                        key={catIndex}
                        className="border border-black/50 rounded-md items-center flex flex-col p-1 bg-white"
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium">Items</label>
                  <Droppable droppableId={`${id}-targetArea`}>
                    {(provided, snapshot) => (
                      <div
                        className="bg-yellow-400 rounded-xl w-[10rem] h-full p-4 min-h-[50px]"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#d1d100"
                            : "#fef08a",
                        }}
                      >
                        {state[id]?.targetItems.map((tItem, tIndex) => (
                          <Draggable
                            key={tItem}
                            draggableId={`${id}-${tItem}`}
                            index={tIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="border border-black/50 rounded-xl p-1 px-2 flex bg-white mb-2"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.5 : 1,
                                }}
                              >
                                {tItem}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          </DragDropContext>
        </div>
      ))}
    </div>
  );
};
