import axios from "axios";
const instance = axios.create({
  baseURL: process.env.MAKOMPARE_URL || "https://web-dev-2019.herokuapp.com"
});

const formatResponse = data => {
  return data.map(product => {
    return {
      ...product,
      image: product.companies[0].image,
      price: product.companies[0].price,
      title: product.name,
      brand: product.companies[0].brand
    };
  });
};

export const searchProducts = async name => {
  const response = await instance.get(`/produtos?q=${name}`);
  return formatResponse(response.data);
};

export const searchProductById = async id => {
  const response = await instance.get(`produtos/${id}`);
  return response.data;
};
