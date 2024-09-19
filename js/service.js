const url = "https://food-pos-data.vercel.app/";

export const getData = async (name) => {
  try {
    const res = await fetch(`${url}${name}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return error.message;
  }
};
export const getItembyId = async (name, id) => {
  try {
    const res = await fetch(`${url}${name}/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return error.message;
  }
};
