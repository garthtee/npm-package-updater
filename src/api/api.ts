import axios from "axios";

const BASE_API = "https://registry.npmjs.org/";

const getPackage = async (packageName: string) => {
  const result = await axios.get(`${BASE_API}${packageName}`);

  return result?.data;
};

export {getPackage};
