import { ExamWithSolutions } from "@/types/exam";
import { FC } from "react";

interface Props {
  examDetail: ExamWithSolutions;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  return <div className="flex flex-col items-center justify-center"></div>;
};

export default MobilePdfView;
