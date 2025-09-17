import { ExamWithSolutions } from "@/types/exam";
import { FC } from "react";

interface Props {
  examDetail: ExamWithSolutions;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  return <div>MobileView</div>;
};

export default MobilePdfView;
