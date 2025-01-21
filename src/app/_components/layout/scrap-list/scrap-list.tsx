import { getAllScrapList } from "@/lib/api";

const ScrapList = async () => {
  const myData = await getAllScrapList();
  console.log("myData", myData);
  return <div>하이</div>;
};

export default ScrapList;
