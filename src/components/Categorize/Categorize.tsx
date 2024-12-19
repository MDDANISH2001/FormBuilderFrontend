import { useCategorizeStore } from "@/utils/CategorizeStore";
import React, { useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

interface QuestionProps {
  questionNumber?: number;
  questionId: string;
  handleDeleteQuestion: (questionId: string) => void;
}

interface DraggableInputRowProps {
  value: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  onRemove?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const DraggableInputRow: React.FC<DraggableInputRowProps> = ({
  value,
  placeholder,
  onChange,
  onRemove,
  onBlur,
  onKeyDown,
}) => (
  <div className="flex items-center space-x-2">
    <span className="cursor-move text-gray-500">⋮⋮</span>
    <input
      className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    )}
  </div>
);

const Categorize: React.FC<QuestionProps> = ({
  questionNumber = 1,
  questionId,
  handleDeleteQuestion,
}) => {
  const { questions, setQuestionData } = useCategorizeStore();

  useEffect(() => {
    if (!questions[questionId]) {
      useCategorizeStore.getState().addQuestion(questionId);
    }
  }, [questionId, questions]);

  const qData = questions?.[questionId] || {
    quesDesc: "",
    points: "",
    categories: [],
    items: [],
    newCategoryName: "",
    newItemName: "",
  };

  const { quesDesc, points, categories, items, newCategoryName, newItemName } =
    qData;

  const setPartial = (data: Partial<typeof qData>) =>
    setQuestionData(questionId, data);

  const handleNewCategoryKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "category" | "items"
  ) => {
    if (e.key === "Enter") {
      finalizeAddition(type);
    }
  };

  const finalizeAddition = (type: "category" | "items") => {
    if (type === "category" && newCategoryName.trim()) {
      addCategory(newCategoryName);
      // setNewCategoryName("");
      setPartial({ newCategoryName: "" });
    } else if (type === "items" && newItemName.trim()) {
      addItem(newItemName);
      // setNewItemName("");
      setPartial({ newItemName: "" });
    }
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      const newCategory = { id: Date.now().toString(), name: trimmed };
      // setCategories([...categories, newCategory]);
      setPartial({ categories: [...categories, newCategory] });
    }
  };

  const addItem = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      const newItem = {
        id: Date.now().toString(),
        name: trimmed,
        category: "",
      };
      // setItems([...items, newItem]);
      setPartial({ items: [...items, newItem] });
    }
  };

  const handleBlur = (type: "category" | "items") => {
    finalizeAddition(type);
  };

  const handleClose = (name: "categories" | "items", index: number) => {
    if (name === "categories") {
      const updated = [...categories];
      updated.splice(index, 1);
      setPartial({ categories: updated });
    } else {
      const updated = [...items];
      updated.splice(index, 1);
      setPartial({ items: updated });
    }
  };

  const handleCategoryChange = (index: number, val: string) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], name: val };
    setPartial({ categories: updated });
  };

  const handleItemChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], name: val };
    setPartial({ items: updated });
  };

  const handleItemCategoryChange = (itemId: string, cName: string) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, category: cName } : item
    );
    setPartial({ items: updated });
  };

  return (
    <div className="p-4 border-l-4 w-full border-blue-500 bg-white rounded-md shadow-sm space-y-4">
      {/* Question Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-700 font-semibold text-lg">
          Question {questionNumber}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => handleDeleteQuestion(questionId as string)}
            disabled={questionNumber === 1}
            className="text-red-500 hover:text-red-700"
          >
            <RiDeleteBin6Line className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Description and Categorize */}
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <input
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Description (Optional)"
            onChange={(e) => setPartial({ quesDesc: e.target.value })}
            value={quesDesc}
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600 font-medium">Categorize</span>
            <button className="text-gray-400 hover:text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v0M12 8v4"></path>
              </svg>
            </button>
          </div>
          <input
            className="border border-gray-300 rounded px-2 py-1 w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Points"
            value={points}
            onChange={(e) => setPartial({ points: e.target.value })}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-gray-700 font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat, index) => (
            <DraggableInputRow
              key={cat.id}
              value={cat.name}
              onChange={(val) => handleCategoryChange(index, val)}
              onRemove={() => handleClose("categories", index)}
            />
          ))}
          <DraggableInputRow
            value={newCategoryName}
            placeholder={`Category ${categories?.length + 1} (Optional)`}
            onChange={(val) => setPartial({ newCategoryName: val })}
            onBlur={() => handleBlur("category")}
            onKeyDown={(e) => handleNewCategoryKeyDown(e, "category")}
          />
        </div>
      </div>

      {/* Items */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-gray-700 font-medium mb-2">Item</h3>
          <div className="space-y-2">
            {items.map((it, index) => (
              <DraggableInputRow
                key={it.id}
                value={it.name}
                onChange={(val) => handleItemChange(index, val)}
                onRemove={() => handleClose("items", index)}
              />
            ))}
            <DraggableInputRow
              value={newItemName}
              placeholder={`Item ${items?.length + 1} (Optional)`}
              onChange={(val) => setPartial({ newItemName: val })}
              onBlur={() => handleBlur("items")}
              onKeyDown={(e) => handleNewCategoryKeyDown(e, "items")}
            />
          </div>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium mb-2">Belongs To</h3>
          <div className="space-y-2">
            {items.map((it) => (
              <select
                key={it.id + "-select"}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={it.category}
                onChange={(e) =>
                  handleItemCategoryChange(it.id, e.target.value)
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            ))}
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={() => {}}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id + "-new"} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorize;
