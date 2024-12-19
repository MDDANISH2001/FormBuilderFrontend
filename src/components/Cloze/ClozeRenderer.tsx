import { useRendererStore } from "@/utils/RendererStore";
import React, { useEffect, useState } from "react";

interface SentenceRendererProps {
  sentence: string;
  words: string[];
  questionId: string;
}

const SentenceRenderer: React.FC<SentenceRendererProps> = ({
  sentence,
  words,
  questionId,
}) => {
  const [selectedWords, setSelectedWords] = useState<{ [key: number]: string }>(
    {}
  );

  const { setClozeData } = useRendererStore();
  // Helper function to clean special characters from words
  const cleanWord = (word: string) =>
    word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

  const renderSentenceWithDropdowns = () => {
    const result: JSX.Element[] = []; // Store the resulting elements
    const sentenceParts = sentence.split(/\b/); // Split the sentence into words, preserving spaces and punctuation

    sentenceParts.forEach((part, index) => {
      const cleanPart = cleanWord(part); // Remove special chars for matching
      const matchIndex = words.findIndex(
        (word) => cleanWord(word).toLowerCase() === cleanPart.toLowerCase()
      );

      if (matchIndex !== -1) {
        // If the word matches, replace it with a dropdown
        result.push(
          <select
            key={`dropdown-${index}`}
            value={selectedWords[index] || "Select word"}
            onChange={(e) =>
              setSelectedWords((prev) => ({
                ...prev,
                [index]: e.target.value,
              }))
            }
            className="border border-gray-300 rounded px-2 py-1 mx-1"
          >
            <option value="Select word" disabled>
              Select word
            </option>
            {words.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      } else {
        // Otherwise, keep the original word
        result.push(<span key={`text-${index}`}>{part}</span>);
      }
    });

    return result;
  };

  useEffect(() => {
    // Construct the sentence with the selected words
    const sentenceParts = sentence.split(/\b/);
    const finalSentence = sentenceParts
      .map((part, index) => {
        return selectedWords[index] || part;
      })
      .join("");

    // Update the Zustand store
    setClozeData(questionId, finalSentence);
  }, [selectedWords, sentence, setClozeData, questionId]);

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      {renderSentenceWithDropdowns()}
    </div>
  );
};

interface ClozeRendererProps {
  clozeItem: {
    [key: string]: {
      sentence: string;
      words: string[];
    };
  };
}

export const ClozeRenderer: React.FC<ClozeRendererProps> = ({ clozeItem }) => {
  const questionsArray = Object.values(clozeItem);

  return (
    <div className="w-[50vw] flex flex-col gap-4 border border-gray-300 p-4 rounded-lg">
      <h3 className="text-lg font-medium">Cloze Questions</h3>
      {questionsArray.map((question, index) => (
        <div key={index} className="p-4 border border-gray-300 rounded-md">
          <h4 className="font-medium mb-2">Question {index + 1}</h4>
          <SentenceRenderer
            sentence={question.sentence}
            words={question.words}
            questionId={Object.keys(clozeItem)?.[index]}
          />
        </div>
      ))}
    </div>
  );
};
