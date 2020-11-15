/**
 * Add years to a copy of given date object
 * @param {Date} dateObject - A date object to be copied add years to
 * @param {number} numberOfYears - The number of years to add
 */
const addYears = (dateObject, numberOfYears) => {
    const newDate = new Date(+dateObject);
    return new Date(newDate.setFullYear(newDate.getFullYear() + numberOfYears));
  };
  
  /**
   * Add days to a copy of given date object
   * @param {Date} dateObject - A date object to be copied to add days to
   * @param {number} numberOfDays - The number of days to add
   */
  const addDays = (dateObject, numberOfDays) => {
    const newDate = dateObject.getTime() + numberOfDays * 86400000;
    return new Date(newDate);
  };
  
  /**
   * Add months to a copy of given date object
   * @param {Date} dateObject - A date object to be copied add years to
   * @param {number} numberOfMonths - The number of months to add
   */
  const addMonths = (dateObject, numberOfMonths) => {
    const newDate = new Date(+dateObject);
    return new Date(newDate.setMonth(newDate.getMonth() + numberOfMonths));
  };
  
  const validateAge = (userDate, threshold) => {
    const today = new Date().getFullYear();
    const newUserDate = new Date(userDate).getFullYear();
    const userAge = today - newUserDate;
    if (userAge < 0) return { status: 'error', message: 'Age is set to future, kindly check again' };
    if (userAge < threshold) return { status: 'error', message: 'User does not meet age requirements!' };
    return { status: 'successful', message: 'age requirements matched' };
  };
  
  const daysBetween = (StartDate, EndDate) => {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;
  
    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());
  
    return (start - end) / oneDay;
  }
  
  const isExpiring = (daysCalculated, dayThresholdToExpire) => {
    return daysCalculated === dayThresholdToExpire;
  }
  
  module.exports = {
    addYears,
    addDays,
    addMonths,
    validateAge,
    daysBetween,
    isExpiring
  };
  