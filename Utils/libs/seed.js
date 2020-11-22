const bcrypt = require('bcryptjs');
const debug = require('debug')('cryptoapi:server');
const inquirer = require('inquirer');
const { v4 } = require('uuid');
const chalk = require('chalk');

const model = require('../../Models');

const { updateUser } = require('../../Controllers/dao/impl/db/user')

const logger = require('../../logger').Logger;


const confirmPasswordInput = async (input) => {
  return input.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(input);
};

const confirmPhone = async (input) => {
  return input.length >= 1;
};


const initAdminAndSave = async (superAdminAccount) => {
  const data = await model.User.create(superAdminAccount);
  // const zuriTalentUserId = genZuriId(data.dataValues.id);
  await updateUser({ email: data.dataValues.email });

  const log = chalk.green('[✔] Super admin created successfully');
  console.log(chalk.blue('[✔] Connected to Db'));
  // const log2 = chalk.yellowBright('[!] Initializing payment plans...');
  console.log(log);
  // console.log(log2);
  return data;
};

const seedSuperAdmin = async () => {

    let adminFromCommandLine = process.argv[2];
    if (adminFromCommandLine)[, adminFromCommandLine] = adminFromCommandLine.split('=');
    let logInit = chalk.yellowBright('[!] Initializing app...');
    console.log(logInit);

    const rolesExists = await model.User.findOne({ where: { roleId: 'ROL-SUPERADMIN' } });
    if (rolesExists) {
      logInit = chalk.green('[✔] Super admin already initialized');
      console.log(chalk.blue('[✔] Connected to Db'));
      console.log(logInit);
    } else {
      // await model.sequelize.drop();
      await model.sequelize.sync({force: true});
      const rolesCreated = await model.Role.bulkCreate([
        { roleName: 'superAdmin', roleId: 'ROL-SUPERADMIN' },
        { roleName: 'admin', roleId: 'ROL-ADMIN' },
        { roleName: 'investor', roleId: 'ROL-INVESTOR' },

      ]);
      
      if (rolesCreated && adminFromCommandLine !== 'false') {
        inquirer
        .prompt([
          {
            name: 'firstName',
            message: 'First Name (default: admin)',
            default: 'admin',
          },
          {
            name: 'lastName',
            message: 'Last Name (default: admin)',
            default: 'admin',
          },
          {
            type: 'password',
            name: 'password',
            message: 'password:',
            mask: '*',
            validate: confirmPasswordInput,
          },
          // {
          //   name: 'phone',
          //   message: 'Phone number:',
          //   validate: confirmPhone,
          // },
          {
            name: 'email',
            message: 'email (default: email@example.com)',
            default: 'email@example.com',
          },
        ])
        .then(async (answers) => {
          // hash password
          const salt = bcrypt.genSaltSync(10);
          const userId = v4();
  
          // eslint-disable-next-line no-param-reassign
          answers.password = await bcrypt.hashSync(answers.password, salt);
          const superAdminAccount = {
            firstName: answers.firstName,
            lastName: answers.lastName,
            // phoneNumber: answers.phone,
            email: answers.email,
            password: answers.password,
            userId,
            roleId: 'ROL-SUPERADMIN',
            status: '1',
          };
          const data = await initAdminAndSave(superAdminAccount);
        });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const userId = v4();
  
        // eslint-disable-next-line no-param-reassign
        const password = await bcrypt.hashSync('AdminAdmin21#', salt);
        const superAdminAccount = {
          firstName: 'admin',
          lastName: 'admin',
         // phoneNumber: '09000000000',
          email: process.env.ZURI_TALENT_FROM_EMAIL,
          password,
          userId,
          roleId: 'ROL-SUPERADMIN',
          status: '1',
        };
        const data = await initAdminAndSave(superAdminAccount);
      }
    }
  };
  
  module.exports.seedSuperAdmin = seedSuperAdmin;