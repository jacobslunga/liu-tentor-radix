import { useParams } from "react-router-dom";

type StatsSearchPageParams = {
  courseCode: string;
};

export default function StatsSearchPage() {
  const { courseCode } = useParams<StatsSearchPageParams>();

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen">
      Stats for {courseCode}
    </div>
  );
}
