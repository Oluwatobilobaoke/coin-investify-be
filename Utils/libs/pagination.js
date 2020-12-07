const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  
  return { limit, offset };
};
  
const getPagingData = (totalItems, page, limit) => {
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalPages, currentPage };
};
  
module.exports = {
  getPagination,
  getPagingData,
}