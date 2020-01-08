const convertPagenation = function (data, currentPage) {
    const totalResult = data.length;
    const perpage = 3;
    const pageTotal = Math.ceil(totalResult / perpage);
    if (currentPage > pageTotal) {
      currentPage = pageTotal;
    }
    const minItem = (currentPage * perpage) - perpage + 1;
    const maxItem = (currentPage * perpage);
    const result = [];
    data.forEach((item, index)=>{
      let itemNum = index + 1;
      if (itemNum >= minItem && itemNum <= maxItem) {
        result.push(item);
        console.log(item.title);
      }
    });
    const page = {
      pageTotal,
      currentPage,
      hasPre: currentPage > 1,
      hasNext: currentPage < pageTotal
    };
    return {
      page,
      result
    };
}

module.exports = convertPagenation;