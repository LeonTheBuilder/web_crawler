const a = require('aframework');
const db = a.db;
const DataTypes = a.models.DataTypes;

const Trace = db.define('Trace',
    {
        id: {
            type: DataTypes.STRING(25),
            allowNull: false,
            primaryKey: true,
        },
        value: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        charset: 'utf8mb4',
        timestamps: true,
        createdAt: true,
        updatedAt: true,
    }
);


module.exports = {
    Trace,
};
