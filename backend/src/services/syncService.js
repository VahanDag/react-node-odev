const Account = require('../models/Account');
const apiService = require('./apiService');
const { sequelize } = require('../config/database');

class SyncService {
  parseNumericValue(value) {
    if (value === '' || value === null || value === undefined || isNaN(value)) {
      return 0;
    }
    return parseFloat(value) || 0;
  }

  async syncAccounts() {
    const transaction = await sequelize.transaction();

    try {
      const apiData = await apiService.fetchAccountData();

      for (const item of apiData) {
        const accountData = {
          hesapKodu: item.hesap_kodu,
          hesapAdi: item.hesap_adi,
          tipi: item.tipi,
          ustHesapId: this.parseNumericValue(item.ust_hesap_id),
          borc: this.parseNumericValue(item.borc),
          alacak: this.parseNumericValue(item.alacak),
          borcDoviz: this.parseNumericValue(item.borc_doviz),
          alacakDoviz: this.parseNumericValue(item.alacak_doviz),
          aktif: item.aktif === 1,
        };

        if (!accountData.hesapKodu) {
          console.warn('Geçersiz hesap kodu, atlaniyor:', item);
          continue;
        }

        try {
          await Account.upsert(accountData, { transaction });
        } catch (error) {
          console.error('Kayıt işlemi hatası:', {
            hesapKodu: accountData.hesapKodu,
            error: error.message,
          });
          continue;
        }
      }

      await transaction.commit();
      console.log('Senkronizasyon başarılı');
    } catch (error) {
      await transaction.rollback();
      console.error('Senkronizasyon hatası:', error);
      throw error;
    }
  }
}

module.exports = new SyncService();
