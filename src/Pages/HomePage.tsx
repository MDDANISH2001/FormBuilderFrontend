import Categorize from "@/components/Categorize/Categorize";
import Cloze from "@/components/Cloze/Cloze";
import Comprehension from "@/components/Comprehension/Comprehension";
import { useCategorizeStore } from "@/utils/CategorizeStore";
import { useClozeStore } from "@/utils/ClozeStore";
import { useComprehensionStore } from "@/utils/ComprehensionStore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { useSaveForm } from "@/apis/useForm"; 
import { ImSpinner10 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const homePageForm = useForm({
    defaultValues: { formTitle: "Untitled Quiz" },
  });
  const { register, watch } = homePageForm;

  const title = watch("formTitle", "Untitled Quiz");

  const userDetails = JSON.parse(localStorage.getItem("userDetails") as string);
  const userId = userDetails?.id;

  const {
    questions: categorizeQuestionsObj,
    addQuestion: categorizeAddQuestion,
    removeQuestion: categorizeRemoveQuestion,
  } = useCategorizeStore();
  const {
    questions: clozeQuestionsObj,
    addQuestion: clozeAddQuestion,
    removeQuestion: clozeRemoveQuestion,
  } = useClozeStore();
  const {
    questions: comprehensionQuestionsObj,
    addQuestion: comprehensionAddQuestion,
    removeQuestion: comprehensionRemoveQuestion,
  } = useComprehensionStore();

  const [categorizeQuestions, setCategorizeQuestions] = useState<string[]>([
    Date.now().toString(),
  ]);
  const [clozeQuestions, setClozeQuestions] = useState<string[]>([
    Date.now().toString(),
  ]);
  const [comprehensionQuestions, setComprehensionQuestions] = useState<
    string[]
  >([Date.now().toString()]);

  useEffect(() => {
    categorizeQuestions.forEach((qId) => {
      if (!categorizeQuestionsObj[qId]) {
        categorizeAddQuestion(qId);
      }
    });
  }, [categorizeQuestions, categorizeQuestionsObj, categorizeAddQuestion]);

  useEffect(() => {
    clozeQuestions.forEach((qId) => {
      if (!clozeQuestionsObj[qId]) {
        clozeAddQuestion(qId);
      }
    });
  }, [clozeQuestions, clozeQuestionsObj, clozeAddQuestion]);

  useEffect(() => {
    comprehensionQuestions.forEach((qId) => {
      if (!comprehensionQuestionsObj[qId]) {
        comprehensionAddQuestion(qId);
      }
    });
  }, [
    comprehensionQuestions,
    comprehensionQuestionsObj,
    comprehensionAddQuestion,
  ]);

  const {
    mutate: saveFormMutation,
    isPending: savingForm,
    isError: savingFailed,
  } = useSaveForm();

  const handleSaveForm = () => {
    console.log("userId :", userId);
    const payload: any = {
      userId,
      title,
    };

    // Only add categorize if it has question data
    if (Object.values(categorizeQuestionsObj)?.[0]?.quesDesc !== "") {
      payload.categorize = categorizeQuestionsObj;
    }

    // Only add cloze if it has question data
    if (Object.values(clozeQuestionsObj)?.[0]?.sentence !== "") {
      payload.cloze = clozeQuestionsObj;
    }

    // Only add comprehension if it has question data
    if (Object.values(comprehensionQuestionsObj)?.[0]?.passage !== "") {
      payload.comprehension = comprehensionQuestionsObj;
    }

    console.log("payload :", payload);
    saveFormMutation(payload, {
      onSuccess: (data) => {
        console.log("Form saved:", data);
      },
      onError: (error) => {
        console.error("Error saving form:", error);
      },
    });
  };

  const handleAddCategorizeQuestion = () => {
    const newId = Date.now().toString();
    setCategorizeQuestions((prev) => [...prev, newId]);
  };

  // Delete a Categorize question
  const handleDeleteCategorizeQuestion = (questionId: string) => {
    setCategorizeQuestions((prev) => prev.filter((id) => id !== questionId));
    categorizeRemoveQuestion(questionId); // Remove from store
  };

  // Add a new Cloze question
  const handleAddClozeQuestion = () => {
    const newId = Date.now().toString();
    setClozeQuestions((prev) => [...prev, newId]);
  };

  // Delete a Cloze question
  const handleDeleteClozeQuestion = (questionId: string) => {
    setClozeQuestions((prev) => prev.filter((id) => id !== questionId));
    clozeRemoveQuestion(questionId); // Remove from store
  };

  const handleAddComprehensionQuestion = () => {
    const newId = Date.now().toString();
    setComprehensionQuestions((prev) => [...prev, newId]);
  };

  const handleDeleteComprehensionQuestion = (questionId: string) => {
    setComprehensionQuestions((prev) => prev.filter((id) => id !== questionId));
    comprehensionRemoveQuestion(questionId);
  };

  const navigate = useNavigate();
  const handleAllForms = () => {
    navigate("/myForms");
  };
  return (
    <div className="border border-red-600 flex p-2 w-full flex-col items-center gap-4">
      <div className="flex justify-between border-b w-full border-black p-2">
        <input
          type="text"
          {...register("formTitle", { value: "Untitled Quiz" })}
          placeholder="Enter Form Title"
          className="border border-gray-400 rounded-sm px-2"
        />
        <button
          type="submit"
          onClick={() => handleSaveForm()}
          className={`${
            savingFailed
              ? "bg-red-400 hover:bg-red-500"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white p-2 px-4 rounded-md `}
        >
          {savingForm ? (
            <ImSpinner10 className="animate-spin w-6 h-6 text-white" />
          ) : (
            "Save & Next"
          )}
        </button>

        <button
          onClick={handleAllForms}
          className="bg-green-400 p-2 px-4 rounded-md hover:bg-green-500"
        >
          View All Forms
        </button>
      </div>

      <div className="w-[80vw] flex border-b-2 border-red-600 pb-4">
        <div className="w-full flex flex-col gap-4">
          {categorizeQuestions?.map((questionId, index) => (
            <div className="w-full relative" key={questionId}>
              <Categorize
                questionNumber={index + 1}
                questionId={questionId}
                handleDeleteQuestion={handleDeleteCategorizeQuestion}
              />
            </div>
          ))}
        </div>

        <button onClick={() => handleAddCategorizeQuestion()} className="flex">
          <HiMiniPlusCircle className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="w-[80vw] flex">
        <div className="w-full flex flex-col gap-4">
          {clozeQuestions?.map((questionId, index) => (
            <div className="w-full relative" key={questionId}>
              <Cloze
                questionNumber={categorizeAddQuestion?.length + index + 1}
                questionId={questionId}
                handleDeleteQuestion={handleDeleteClozeQuestion}
              />
            </div>
          ))}
        </div>

        <button onClick={() => handleAddClozeQuestion()} className="flex">
          <HiMiniPlusCircle className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="w-[80vw] flex">
        <div className="w-full flex flex-col gap-4">
          {comprehensionQuestions.map((questionId, index) => (
            <div className="w-full relative" key={questionId}>
              <Comprehension
                questionNumber={
                  categorizeAddQuestion?.length +
                  clozeAddQuestion?.length +
                  index +
                  1
                }
                questionId={questionId}
                handleDeleteQuestion={handleDeleteComprehensionQuestion}
              />
            </div>
          ))}
        </div>
        <button onClick={handleAddComprehensionQuestion} className="flex">
          <HiMiniPlusCircle className="w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
};
