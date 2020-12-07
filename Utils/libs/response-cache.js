const {
    getDposit,
    createDeposit,
    updateDeposit,
    deleteDeposit,
  } = require('../../Controllers/dao/impl/db/deposit');
  const {
    createPortfolio,
    getPortfolios,
    updatePortfolio,
    deletePortfolio} = require('../../Controllers/dao/impl/db/portfolio');
  const recordActivity = require('./activity-cache');
  const Cache = require('./cache');
  const { errorResMsg, successResMsg } = require('./response');
  
  const cache = new Cache();
  
  const getData = (res, data, type) => {
    let dataInfo;
    switch (type) {
      case 'portfolio':
        if (!data) {
          return errorResMsg(res, 404, 'No portfolios found!');
        }
        dataInfo = { message: `${data.length} Portfolios found`, data };
        return successResMsg(res, 200, dataInfo);
      case 'deposit':
        if (!data) {
          return errorResMsg(res, 404, 'No deposits found!');
        }
        dataInfo = { message: `${data.length} deposits found`, data };
        return successResMsg(res, 200, dataInfo);
      default:
        break;
    }
    return null;
  };
  
  const updateData = (res, data, type) => {
    let dataInfo;
    switch (type) {
      case 'portfolio':
        if (!data) {
          return errorResMsg(res, 404, 'No portfolios found!');
        }
        dataInfo = { message: 'Portfolio updated successfully' };
        return successResMsg(res, 200, dataInfo);
      case 'deposit':
        if (!data) {
          return errorResMsg(res, 404, 'No deposits found!');
        }
        dataInfo = { message: 'deposit updated successfully' };
        return successResMsg(res, 200, dataInfo);
      default:
        break;
    }
    return null;
  };
  
  const deleteData = (res, data, type) => {
    let dataInfo;
    switch (type) {
      case 'portfolio':
        if (!data) {
          return errorResMsg(res, 404, 'No portfolios found!');
        }
        dataInfo = { message: 'Portfolio deleted successfully' };
        return successResMsg(res, 200, dataInfo);
      case 'deposit':
        if (!data) {
          return errorResMsg(res, 404, 'No deposits found!');
        }
        dataInfo = { message: 'deposit deleted successfully' };
        return successResMsg(res, 200, dataInfo);
      default:
    }
    return null;
  };
  
  const createData = async (res, queryData, type) => {
    let dataInfo;
    let data;
    let portfolio;
    let deposit;
    switch (type) {
      case 'portfolio':
        portfolio = await queryData;
        data = portfolio.dataValues;
        dataInfo = {
          message: 'Portfolio created successfully',
          data,
        };
        successResMsg(res, 201, dataInfo);
        break;
  
      case 'deposit':
        deposit = await queryData;
        data = deposit.dataValues;
        dataInfo = {
          message: 'deposit created successfully',
          data,
        };
        successResMsg(res, 201, dataInfo);
        break;
  
      default:
        break;
    }
  };
  
  const getAndCache = async (res, keyId, userId, type) => {
    let data;
    let portfolio;
    let deposit;
    switch (type) {
      case 'portfolio':
        data = await cache.get(keyId);
        // Fetching from cache... ✔
        if (data) {
          portfolio = data;
          return getData(res, portfolio, 'portfolio');
        }
        if (!data) {
          const query = await getPortfolios(userId);
          const portfolioData = await query;
          if (portfolioData) {
            const obj = portfolioData;
            // Add caching here... ✔
            await cache.set(keyId, obj);
            return getData(res, obj, 'portfolio');
          }
        }
        break;
      case 'deposit':
        data = await cache.get(keyId);
        // Fetching from cache... ✔
        if (data) {
          deposit = data;
          return getData(res, deposit, 'deposit');
        }
        if (!deposit) {
          const query = await getPortfolios(userId);
          const depositData = await query;
          if (depositData) {
            const obj = depositData;
            // Add caching here... ✔
            await cache.set(keyId, obj);
            return getData(res, obj, 'deposit');
          }
        }
        break;
      default:
        break;
    }
    return null;
  };
  
  const createAndCache = async (res, keyId, userId, bodyToCreate, type) => {
    let data;
    let portfolio;
    let deposit;
    switch (type) {
      case 'portfolio':
        data = await createPortfolio(bodyToCreate);
        portfolio = await getPortfolios(userId);
        // Setting data to cache ✔
        await recordActivity(res, userId, 'create', 'You added a portfolio.');
        await cache.set(keyId, portfolio);
        return createData(res, data, 'portfolio');
      case 'deposit':
        data = await createdeposit(bodyToCreate);
        deposit = await getdeposit(userId);
        // Setting data to cache ✔
        await recordActivity(res, userId, 'create', 'You added a deposit.');
        await cache.set(keyId, deposit);
        return createData(res, data, 'deposit');
      default:
        break;
    }
    return null;
  };
  
  const updateAndCache = async (res, keyId, id, userId, bodyToUpdate, type) => {
    let portfolio;
    let deposit;
    switch (type) {
      case 'portfolio':
        await updatePortfolio(bodyToUpdate, id, userId);
        portfolio = await getPortfolios(userId);
        // Setting data to cache ✔
        await recordActivity(res, userId, 'update', 'You updated a portfolio');
        await cache.set(keyId, portfolio);
        return updateData(res, portfolio, 'portfolio');
      case 'deposit':
        await updatedeposit(bodyToUpdate, id, userId);
        deposit = await getdeposit(userId);
        // Setting data to cache ✔
        await recordActivity(res, userId, 'update', 'You updated a deposit');
        await cache.set(keyId, deposit);
        return updateData(res, deposit, 'deposit');
      default:
        break;
    }
    return null;
  };
  
  const deleteAndCache = async (res, keyId, id, userId, type) => {
    let portfolio;
    let deposit;
    switch (type) {
      case 'portfolio':
        await deletePortfolio(id, userId);
        portfolio = await getPortfolios(userId);
        // Setting data to cache ✔
        await recordActivity(res, userId, 'delete', 'You deleted a portfolio');
        await cache.set(keyId, portfolio);
        return deleteData(res, portfolio, 'portfolio');
      case 'deposit':
        await deletedeposit(id, userId);
        deposit = await getdeposit(userId);
        // Setting data to cache ✔
        await recordActivity(res, userId, 'delete', 'You deleted a deposit');
        await cache.set(keyId, deposit);
        return deleteData(res, deposit, 'deposit');
      default:
        break;
    }
    return null;
  };
  
  module.exports = {
    getAndCache,
    createAndCache,
    updateAndCache,
    deleteAndCache,
  };
  