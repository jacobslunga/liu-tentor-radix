import { useLanguage } from "@/context/LanguageContext";
import translations from "@/util/translations";
import React from "react";
import CourseSearchDropdown from "./CourseSearchDropdown";

interface MainInputProps {
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainInput: React.FC<MainInputProps> = ({ setFocusInput }) => {
  const { language } = useLanguage();

  const getTranslation = (key: keyof (typeof translations)[typeof language]) =>
    translations[language][key];

  return (
    <div className="relative w-full">
      <CourseSearchDropdown
        className="w-full"
        placeholder={getTranslation("searchCoursePlaceholder")}
        variant="main-input"
        onFocus={() => setFocusInput(true)}
        onBlur={() => setFocusInput(false)}
      />
    </div>
  );
};

export default MainInput;
