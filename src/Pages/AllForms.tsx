import { useUserForms } from "@/apis/useForm";
import React from "react";
import { ImSpinner10 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

export const AllForms: React.FC = () => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails") as string);

  const { data: allForms, isLoading, isError } = useUserForms(userDetails?.id);

  const navigate = useNavigate();

  const handleShowForm = (item: any) => {
    console.log("item :", item);
    navigate("/formResponse", { state: { item } });
  };

  return isLoading ? (
    <ImSpinner10 className="animate-spin w-8 h-8 text-black" />
  ) : isError ? (
    <div>You have not saved any forms yet!</div>
  ) : (
    <div className="w-[50vw] flex flex-col items-center p-4">
      <label className="text-xl font-medium">All Forms</label>
      <div className="w-full flex flex-col gap-2">
        {allForms?.form?.map((item, index) => (
          <div key={index} className="flex justify-between w-full">
            <div
              className="border border-zinc-600 p-2 px-4 rounded-md"
              key={index}
            >
              {item.title}
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 p-2 text-white rounded-md"
              onClick={() => handleShowForm(item)}
            >
              View Form
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
