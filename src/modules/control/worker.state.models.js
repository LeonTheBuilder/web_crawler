const a = require('aframework');
const db = a.db;
const DataTypes = a.models.DataTypes;


// worker 状态
const WorkerState = db.define('WorkerState',
    {
        id: {
            type: DataTypes.STRING(25),
            allowNull: false,
            primaryKey: true,
        },
        sifStatus: {
            type: DataTypes.STRING(255),
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
    WorkerState,
};
