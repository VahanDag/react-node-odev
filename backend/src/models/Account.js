const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Account = sequelize.define(
  'Account',
  {
    hesapKodu: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'hesap_kodu',
    },
    hesapAdi: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'hesap_adi',
    },
    tipi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ustHesapId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ust_hesap_id',
      defaultValue: 0,
    },
    borc: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    alacak: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    borcDoviz: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'borc_doviz',
    },
    alacakDoviz: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'alacak_doviz',
    },
    aktif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: 'accounts',
  },
);

module.exports = Account;
