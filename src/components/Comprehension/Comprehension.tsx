import React, { useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useComprehensionStore } from "@/utils/ComprehensionStore";

interface ComprehensionProps {
  questionNumber?: number;
  questionId: string;
  handleDeleteQuestion: (questionId: string) => void;
}

interface ComprehensionMCQOption {
  id: string;
  text: string;
}

interface ComprehensionMCQ {
  id: string;
  question: string;
  options: ComprehensionMCQOption[];
  correctIndex: number | null;
}

const Comprehension: React.FC<ComprehensionProps> = ({
  questionNumber = 1,
  questionId,
  handleDeleteQuestion,
}) => {
  const { questions, addQuestion, setQuestionData } = useComprehensionStore();

  useEffect(() => {
    if (!questions[questionId]) {
      addQuestion(questionId);
    }
  }, [questionId, questions, addQuestion]);

  if (!questionId) return null;

  const qData = questions[questionId] || { passage: "", mcqs: [] };
  const { passage, mcqs } = qData;

  const setPartial = (data: Partial<typeof qData>) =>
    setQuestionData(questionId, data);

  const handlePassageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPartial({ passage: e.target.value });
  };

  const addMCQ = () => {
    const newMCQ: ComprehensionMCQ = {
      id: Date.now().toString(),
      question: "",
      options: [
        { id: Date.now().toString() + "-opt1", text: "" },
        { id: Date.now().toString() + "-opt2", text: "" },
        { id: Date.now().toString() + "-opt3", text: "" },
        { id: Date.now().toString() + "-opt4", text: "" },
      ],
      correctIndex: null,
    };
    setPartial({ mcqs: [...mcqs, newMCQ] });
  };

  const removeMCQ = (mcqId: string) => {
    const updated = mcqs.filter((m) => m.id !== mcqId);
    setPartial({ mcqs: updated });
  };

  const handleMCQQuestionChange = (mcqId: string, value: string) => {
    const updated = mcqs.map((m) =>
      m.id === mcqId ? { ...m, question: value } : m
    );
    setPartial({ mcqs: updated });
  };

  const handleOptionChange = (
    mcqId: string,
    optIndex: number,
    value: string
  ) => {
    const updated = mcqs.map((m) => {
      if (m.id === mcqId) {
        const newOptions = [...m.options];
        newOptions[optIndex] = { ...newOptions[optIndex], text: value };
        return { ...m, options: newOptions };
      }
      return m;
    });
    setPartial({ mcqs: updated });
  };

  const handleCorrectChange = (mcqId: string, optIndex: number) => {
    const updated = mcqs.map((m) =>
      m.id === mcqId ? { ...m, correctIndex: optIndex } : m
    );
    setPartial({ mcqs: updated });
  };

  return (
    <div className="p-4 border-l-4 border-blue-500 bg-white rounded-md shadow-sm space-y-4 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-700 font-semibold text-lg">
          Question {questionNumber}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => handleDeleteQuestion(questionId)}
            disabled={questionNumber === 1}
            className="text-red-500 hover:text-red-700"
          >
            <RiDeleteBin6Line className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Passage Input */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">Passage</label>
        <textarea
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full h-28"
          placeholder="Type your Passage here......"
          value={passage}
          onChange={handlePassageChange}
        />
      </div>

      {/* MCQ Section */}
      <div className="space-y-4">
        {mcqs.map((mcq, mcqIndex) => (
          <div
            key={mcq.id}
            className="border border-gray-300 rounded p-4 relative space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-700 font-medium">
                Question {questionNumber}.{mcqIndex + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeMCQ(mcq.id)}
                className="text-red-500 hover:text-red-700"
              >
                <RiDeleteBin6Line className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* MCQ Question Input */}
            <div className="flex flex-col space-y-1">
              <input
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                value={mcq.question}
                onChange={(e) =>
                  handleMCQQuestionChange(mcq.id, e.target.value)
                }
                placeholder="Type your MCQ question here..."
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              {mcq.options.map((opt, optIndex) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`mcq-${mcq.id}`}
                    checked={mcq.correctIndex === optIndex}
                    onChange={() => handleCorrectChange(mcq.id, optIndex)}
                  />
                  <input
                    className="border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={opt.text}
                    onChange={(e) =>
                      handleOptionChange(mcq.id, optIndex, e.target.value)
                    }
                    placeholder={`Option ${optIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add MCQ Button */}
      <button
        type="button"
        onClick={addMCQ}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Add MCQ
      </button>
    </div>
  );
};

export default Comprehension;
