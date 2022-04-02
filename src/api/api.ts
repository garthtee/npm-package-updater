import axios from "axios";
import { getRegistrySetting } from "../utils/settings";

const getPackage = async (packageName: string) => {
  const registry = getRegistrySetting();

  const result = await axios.get(`${registry}/${packageName}`);

  return result?.data;
};

export {getPackage};
