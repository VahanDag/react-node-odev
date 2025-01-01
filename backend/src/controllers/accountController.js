const Account = require('../models/Account');

class AccountController {
  async getAllAccounts(req, res) {
    try {
      const accounts = await Account.findAll({
        order: [['hesap_kodu', 'ASC']],
      });

      const formattedAccounts = accounts.map((account) => ({
        accountCode: account.hesapKodu,
        totalDebt: Math.abs(
          parseFloat(account.borc) - parseFloat(account.alacak),
        ),
        level: account.hesapKodu.split('.').length,
        parentCode: account.hesapKodu.split('.').slice(0, -1).join('.') || null,
      }));

      res.json(formattedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAccountById(req, res) {
    try {
      const account = await Account.findOne({
        where: { hesap_kodu: req.params.code },
      });

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      const formattedAccount = {
        accountCode: account.hesapKodu,
        totalDebt: parseFloat(account.borc) - parseFloat(account.alacak),
        level: account.hesapKodu.split('.').length,
        parentCode: account.hesapKodu.split('.').slice(0, -1).join('.') || null,
      };

      res.json(formattedAccount);
    } catch (error) {
      console.error('Error fetching account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAccountsByLevel(req, res) {
    try {
      const { level } = req.params;
      const allAccounts = await Account.findAll();

      const filteredAccounts = allAccounts
        .filter(
          (account) => account.hesapKodu.split('.').length === parseInt(level),
        )
        .map((account) => ({
          accountCode: account.hesapKodu,
          totalDebt: parseFloat(account.borc) - parseFloat(account.alacak),
          level: parseInt(level),
          parentCode:
            account.hesapKodu.split('.').slice(0, -1).join('.') || null,
        }));

      res.json(filteredAccounts);
    } catch (error) {
      console.error('Error fetching accounts by level:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new AccountController();
