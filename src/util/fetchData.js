async function fetchData() {
    const response = await fetch("http://114.119.185.166:6080/axes_app1/llz/");
    const data = await response.json();
    return data[0]; // 返回第一个对象
  }
  
  export default fetchData;
  