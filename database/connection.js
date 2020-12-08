const Sequelize = require('sequelize');

var sequelize = new Sequelize("mywork", "root", "Smile001", {
    host: "aws-albenus.ck3qlagv4gpd.us-east-2.rds.amazonaws.com",
    dialect: "mysql",
    logging: function () {},
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;