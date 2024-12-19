import React, { useEffect, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useClozeStore } from "@/utils/ClozeStore";

interface Word {
  id: string;
  text: string;
}

interface ClozeProps {
  questionNumber?: number;
  questionId: string;
  handleDeleteQuestion: (questionId: string) => void;
}

const Cloze: React.FC<ClozeProps> = ({
  questionNumber = 1,
  questionId,
  handleDeleteQuestion,
}) => {
  const { questions, addQuestion, setQuestionData } = useClozeStore();
  const [selectionInfo, setSelectionInfo] = React.useState<{
    text: string;
    top: number;
    left: number;
  } | null>(null);
  const [toolTipVisible, setToolTipVisible] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (questionId && !questions[questionId]) {
      addQuestion(questionId);
    }
  }, [questionId, questions, addQuestion]);

  if (!questionId) {
    return null; // No questionId means we can't track data in the store
  }

  const qData = questions[questionId] || { sentence: "", words: [] };
  const { sentence, words } = qData;

  const setPartial = (data: Partial<typeof qData>) =>
    setQuestionData(questionId, data);

  // Whenever words update, re-underline them in the sentence display if needed.
  // For simplicity, we’ll just replace occurrences of these words in the displayed version.
  const getUnderlinedSentence = (): string => {
    let rendered = sentence;
    for (const w of words) {
      // Simple replacement: wrap the first occurrence of w.text in <u>
      // If you want multiple occurrences or more complex logic, adjust here.
      if (w.text.trim()) {
        const regex = new RegExp(`(${w.text})`, "i");
        rendered = rendered.replace(regex, `<u>$1</u>`);
      }
    }
    return rendered;
  };

  // When the user selects text in the textarea, show the underline tooltip button
  const handleTextSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.toString().trim() === "") {
      setSelectionInfo(null);
      return;
    }

    // Attempt to get the selection coordinates relative to the textarea
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setSelectionInfo({
        text: sel.toString(),
        top: rect.top - containerRect.top - 30,
        left: rect.left - containerRect.left,
      });
    }
  };

  // Add a selected substring as a word
  const underlineSelectedText = () => {
    if (selectionInfo && selectionInfo.text.trim()) {
      addWord(selectionInfo.text.trim());
      setSelectionInfo(null);
    }
  };

  const addWord = (text: string) => {
    if (text.trim() === "") return;
    // Check if already exists
    if (!words.find((w) => w.text.toLowerCase() === text.toLowerCase())) {
      const newEntry: Word = { id: Date.now().toString(), text: text };
      setPartial({ words: [...words, newEntry] });
    }
  };

  const getPreviewWithUnderscores = (): string => {
    let previewText = sentence;
    for (const w of words) {
      const underscores = "_".repeat(w.text.length);
      const regex = new RegExp(`(${w.text})`, "i");
      previewText = previewText.replace(regex, underscores);
    }
    return previewText;
  };

  // Listen for selection changes inside the textarea
  useEffect(() => {
    const current = containerRef.current;
    if (!current) return;

    const listener = () => handleTextSelect();
    current.addEventListener("mouseup", listener);
    current.addEventListener("keyup", listener);

    return () => {
      current.removeEventListener("mouseup", listener);
      current.removeEventListener("keyup", listener);
    };
  }, [containerRef]);

  return (
    <div className="p-4 border-l-4 border-blue-500 bg-white rounded-md shadow-sm space-y-4 relative">
      <div className="w-full flex justify-between">
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

      {/* Preview Input */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium">
          Preview<span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 min-h-8 rounded px-2 py-1 bg-gray-100 whitespace-pre-wrap">
          {getPreviewWithUnderscores()}
        </div>
      </div>

      {/* Sentence (display) */}
      <div className="relative" ref={containerRef}>
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">
            Sentence<span className="text-red-500">*</span>
          </label>
          <div
            className="absolute top-4 left-0 w-full h-[80%] pointer-events-none whitespace-pre-wrap p-2"
            style={{ color: "#000" }}
            dangerouslySetInnerHTML={{ __html: getUnderlinedSentence() }}
          />
          <textarea
            ref={textareaRef}
            className="border border-gray-300 rounded px-2 py-1 w-full h-20 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent relative"
            value={sentence}
            style={{ color: "transparent", caretColor: "black" }}
            onChange={(e) => setPartial({ sentence: e.target.value })}
            onFocus={() => setToolTipVisible(true)}
            onBlur={() => setToolTipVisible(false)}
          />
        </div>

        {/* Tooltip button for underline when text is selected */}
        {(toolTipVisible || selectionInfo) && (
          <div className="absolute -top-8 bg-white border border-gray-300 rounded shadow-lg p-2">
            <button
              type="button"
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
              onClick={underlineSelectedText}
            >
              Underline
            </button>
          </div>
        )}
      </div>

      {/* Words checkboxes */}
      <div className="space-y-2">
        {words.map((w, i) => (
          <div key={w.id} className="flex items-center space-x-2">
            <span className="cursor-move text-gray-500">⋮⋮</span>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
            <input
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
              value={w.text}
              onChange={(e) => {
                const updated = [...words];
                updated[i] = { ...updated[i], text: e.target.value };
                setPartial({ words: updated });
              }}
            />
          </div>
        ))}
        {/* New word input */}
      </div>
    </div>
  );
};

export default Cloze;
