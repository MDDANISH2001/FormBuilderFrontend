import React, { useState } from "react";
import { useRendererStore } from "@/utils/RendererStore";

interface Option {
  id: string;
  text: string;
}

interface MCQ {
  id: string;
  question: string;
  options: Option[];
  correctIndex: number;
}

interface ComprehensionItem {
  [key: string]: {
    passage: string;
    mcqs: MCQ[];
  };
}

interface ComprehensionRendererProps {
  comprehensionItem: ComprehensionItem;
}

export const ComprehensionRenderer: React.FC<ComprehensionRendererProps> = ({
  comprehensionItem,
}) => {
  // Convert object values into an array
  const questionsArray = Object.values(comprehensionItem);
  const { setComprehensionData } = useRendererStore();

  // State to track selected answers for each question
  const [selectedOptions, setSelectedOptions] = useState<{
    [mcqId: string]: string;
  }>({});

  const handleOptionChange = (mcqId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [mcqId]: optionId,
    }));
    setComprehensionData(mcqId, optionId);
  };

  return (
    <div className="w-[50vw] flex flex-col gap-6">
      {questionsArray.map((questionBlock, blockIndex) => (
        <div
          key={blockIndex}
          className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
        >
          {/* Render Passage */}
          <h3 className="text-lg font-medium mb-4">Passage</h3>
          <div className="border border-gray-300 p-4 rounded bg-gray-100 mb-6">
            {questionBlock.passage}
          </div>

          {/* Render MCQs */}
          <h4 className="text-lg font-medium mb-4">Questions</h4>
          {questionBlock.mcqs.map((mcq) => (
            <div
              key={mcq.id}
              className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50"
            >
              <h5 className="font-medium mb-2">{mcq.question}</h5>
              <div className="flex flex-col gap-2">
                {mcq.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={mcq.id}
                      value={option.id}
                      checked={selectedOptions[mcq.id] === option.id}
                      onChange={() => handleOptionChange(mcq.id, option.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
