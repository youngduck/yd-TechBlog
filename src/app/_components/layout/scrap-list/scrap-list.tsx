const fetchPostss = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const responseData = await response.json();
  console.log("서버", responseData);
  return responseData;
};

const ScrapList = async () => {
  const myData = await fetchPostss();
  console.log("myData", myData);
  return <div>하이</div>;
};

export default ScrapList;
