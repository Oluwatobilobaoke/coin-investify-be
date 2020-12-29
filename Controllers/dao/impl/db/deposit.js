const model = require('../../../../models');

const interestRate = process.COIN_INVESTIFY_INVESTMENT_PERCENTAGE / process.env.COIN_INVESTIFY_INVESTMENT_DAYS;
console.log(interestRate);
module.exports = {
  getADepositById: async (depositId) => {
    return model.Deposit.findOne({ where: { depositId } });
  },
  getDepositByCoinbaseCode: async (txnCode) => {
    return model.Deposit.findOne({ where: { txnCode } });
  },
  getAllDepositsFromSingleUser: async (userId, attributes, limit, offset) => {
    return model.Deposit.findAndCountAll({
      where: {
         userId 
        },
        limit,
        offset,
        attributes,
      });
  },
  createDeposit: async (data) => {
    return model.Deposit.create(data);
  },
  // getInvestorWithAttributes: async (attributesTalents) => {
  //   return model.Deposit.findAll({
  //     // TODO: bring line 19 back when email for email verification is settled
  //     // where: { status: '1', roleId: 'ROL-EMPLOYEE' },
  //     where: { roleId: 'ROL-INVESTOR' },
  //     attributes: attributesTalents,
  //   });
  // },
  updateDepositStatus: async (txnCode, status) => {
    return model.Deposit.update({ DepositStatus: status }, { where: { txnCode } });
  },


  
  updateDepositDateStatus: async (txnCode, date) => {
  /**
 * The Code below from line 54 to 107 is about calculating a certain amount of working days from a particular date.
 */
    // javascript 0 is sunday and 6 is saturday
    const saturday = 6;
    const sunday = 0;

    const isWeekday = (date) => {
      const dayInWeek = date.getDay();
      if (dayInWeek === saturday || dayInWeek === sunday) return false;
      return true;
    };

    const formatDate = (date) => {
      date = new Date(date)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const subtractWeekendsIfLastDayFallsOnIt = (getTotalDate, dayToStart) => {
      const dayNumberInAWeek = getTotalDate.getDay();
      const newDateFromWeekend = new Date(dayToStart);
      if (dayNumberInAWeek === sunday) {
        getTotalDate = new Date(newDateFromWeekend.setDate(getTotalDate.getDate() - 2));
      } else {
        getTotalDate = new Date(newDateFromWeekend.setDate(getTotalDate.getDate() - 1));
      }
      return getTotalDate
    }

    const returnDateAfterGivenWorkingDays = (dayToStart, numberOfWorkingDays) => {
      if (dayToStart && numberOfWorkingDays){
        const dayGiven = new Date(dayToStart);

        if (Number.isNaN(dayGiven.getTime())) return 'param dayToStart should be a valid date string';
        if (numberOfWorkingDays < 0) return 'param numberOfWorkingDays cannot be negative';
        if (typeof numberOfWorkingDays !== 'number') return 'param numberOfWorkingDays must be a number';

        if (!isWeekday(dayGiven)) return 'Date set is not a working day';
        const dateToBeSet = new Date(dayToStart);
        const numberOfWorkingWeeks = numberOfWorkingDays / 5;
        const numberOfDaysToAdd = numberOfWorkingWeeks * 7;

        let getTotalDate = new Date(dateToBeSet.setDate(dayGiven.getDate() + numberOfDaysToAdd - 1));
        
        // check if the last day is a weekend and subtract the days from it
        if (!isWeekday(getTotalDate)) {
          getTotalDate = subtractWeekendsIfLastDayFallsOnIt(getTotalDate, dayToStart);
        }
        return formatDate(getTotalDate);
      }
      return false;
    }


    // js YYYY-MM-DD
    const dateToMature = returnDateAfterGivenWorkingDays(date, 26);
    console.log('Achieved Mature Date is ', dateToMature);



    return model.Deposit.update({ dateConfirmed: date, matureDate: dateToMature, isActive: true, daysLeftToMature: 26 }, { where: { txnCode } });
  },

  updateInterestPerday: async (txnCode, amountInUsd) => {
    const interestPerDay = amountInUsd * interestRate;
    return model.Deposit.update({ interestPerDay }, { where: { txnCode }});
  },

  updateDeposit: async (clause, data) => {
    return model.Deposit.update({ ...data }, { where: { ...clause } });
  },
  updateInvestorDepositData: async (data, depositId) => {
    return model.Deposit.update(data, { where: { depositId } });
  },
  getAllDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			limit,
			offset,
		});
	},
	getAllSuccessfullDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			where: {
				DepositStatus: 'Approved'
			},
			limit,
			offset,
		});
	},
	getAllPendingDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			where: {
				DepositStatus: 'Pending'
			},
			limit,
			offset,
		});
	},
	getAllDisapprovedDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			where: {
				DepositStatus: 'Cancelled'
			},
			limit,
			offset,
		});
  },
  deleteDepositById: async (depositId) => {
    return model.Deposit.destroy({ where: { depositId } });
  },
  getDepositAttributes: async (depositId, attributes) => {
    return model.Deposit.findOne({ where: { depositId }, attributes });
  },
  getAllTalents: async (attributes) => {
    return model.Deposit.findAll({
      // TODO: bring line 74 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE', profileCreated: true },
      where: { roleId: 'ROL-EMPLOYEE', profileCreated: true },
      attributes,
    });
  },
};
