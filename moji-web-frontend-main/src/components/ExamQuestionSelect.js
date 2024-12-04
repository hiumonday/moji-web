import React from "react";
import { Button, Menu, MenuHandler, MenuList } from "@material-tailwind/react";
import { ChevronDownIcon, BookmarkIcon } from "@heroicons/react/24/outline";

const ExamQuestionSelect = ({
  unanswered,
  openMenu,
  setOpenMenu,
  selectedQuestion,
  selectedModule,
  setSelectedQuestion,
  modules,
  exam,
  savedQuestions
}) => {
  const handleQuestionSelect = (id) => {
    setSelectedQuestion(id);
    setOpenMenu(false);
  };

  const notAnswered = (id) => {
    // Check if the question's index is in the unanswered array
    return unanswered.includes(
      modules
        ?.find((mod) => mod._id === selectedModule)
        ?.questions.findIndex((ques) => ques._id === id)
    );
  };

  const isSelectDisabled = (questionId) => {
    if (selectedQuestion === questionId) return true;

    const selectedModuleObj = exam?.modules?.find(
      (mod) => mod.module === selectedModule
    );

    if (selectedModuleObj) {
      return !selectedModuleObj.questions.some(
        (question) => question.question === questionId
      );
    }

    return true;
  };

  return (
    <div className="mt-8 sm:mt-0">
              
    <Menu
      open={openMenu}
      placement="top"
      offset={30}
      handler={() => setOpenMenu(!openMenu)}
      dismiss={{ itemPress: false, isRequired: {} }}
    >
      <MenuHandler>
        <Button
          color="blue"
          className="flex items-center gap-3 text-base font-normal capitalize tracking-normal text-white"
        >
          Select Question:{" "}
          {modules?.find((mod) => mod._id === selectedModule)?.name},
          Question{" "}
          {modules
            ?.find((mod) => mod._id === selectedModule)
            ?.questions?.findIndex(
              (ques) => ques._id === selectedQuestion
            ) + 1}
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 p-5 h-96 flex flex-col items-center">
        <h3 className="text-gray-700 mt-4">Select Question</h3>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {modules
  ?.find((mod) => mod._id === selectedModule)
  ?.questions.map((ques, i) => (
    <button
    onClick={() => handleQuestionSelect(ques._id)}
    key={ques._id}
    disabled={isSelectDisabled(ques._id)}
    className={`w-10 h-10 flex justify-center items-center border-2 rounded-sm relative ${
      isSelectDisabled(ques._id)
        ? "bg-[#365f9c] text-white border-[#365f9c]" // Darker shade of blue for disabled state
        : notAnswered(ques._id)
        ? "bg-[#f3f3f7] text-[#5476b6] border-dashed border-[#5476b6] hover:bg-[#5476b6] hover:text-[#f3f3f7]" // Change color to inverse of answered questions and border to same color as background for unanswered questions
        : "bg-[#5476b6] text-white border-[#5476b6]" // Darker shade of blue for answered state
    } transition border`}
  >
    {i + 1}
    {savedQuestions.includes(ques._id) && (
      <BookmarkIcon className="h-5 w-5 absolute -top-2 -right-2 text-yellow-500 fill-current stroke-black stroke-1" />
    )}
  </button>
  ))}
        </div>
      </MenuList>
    </Menu>
    </div>
  );
};

export default ExamQuestionSelect;
