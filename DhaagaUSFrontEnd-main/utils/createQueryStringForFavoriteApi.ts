export default (prodId: string, fav: string) => {
  const paramsObj = { productId: prodId, favorite: fav };
  const searchParams = new URLSearchParams(paramsObj);
  const queryString = searchParams.toString();

  return queryString;
};
