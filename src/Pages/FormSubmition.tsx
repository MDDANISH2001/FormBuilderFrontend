import { useSaveFormResponse } from "@/apis/useForm";
import { CategorizeRenderer } from "@/components/Categorize/CategorizeRenderer";
import { ClozeRenderer } from "@/components/Cloze/ClozeRenderer";
import { ComprehensionRenderer } from "@/components/Comprehension/ComprehensionRenderer";
import { useRendererStore } from "@/utils/RendererStore";
import React from "react";
import { ImSpinner10 } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";

export const FormSubmition: React.FC = () => {
  const location = useLocation();
  const { item } = location.state || {};
  console.log("item :", item);
  const { comprehension, categorize, cloze } = useRendererStore();

  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails") as string);
  const userId = userDetails?.id;

  const {
    mutate: saveFormResponseMutation,
    isPending,
    isError,
  } = useSaveFormResponse();

  const handleSubmitResponse = () => {
    console.log("userId :", userId);
    const payload: any = {
      userId,
      questionId: item?._id,
      comprehension: comprehension,
      cloze: cloze,
      categoriz: categorize,
    };

    console.log("payload :", payload);
    saveFormResponseMutation(payload, {
      onSuccess: (data) => {
        console.log("Form saved:", data);
        navigate("/myForms");
      },
      onError: (error) => {
        console.error("Error saving form:", error);
      },
    });
  };
  return (
    <div className="flex flex-col gap-4 items-center py-8">
      <h2 className="font-medium text-2xl">Form Title: {item?.title}</h2>

      <CategorizeRenderer item={item?.categorize} />

      <ClozeRenderer clozeItem={item?.cloze} />

      <ComprehensionRenderer comprehensionItem={item?.comprehension} />

      <button
        className={`${
          isError
            ? "bg-red-400 hover:bg-red-500"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white p-2 px-4 rounded-md `}
        onClick={() => handleSubmitResponse()}
      >
        {isPending ? (
          <ImSpinner10 className="animate-spin w-6 h-6 text-white" />
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};
