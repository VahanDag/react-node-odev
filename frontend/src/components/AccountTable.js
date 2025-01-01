import { useState } from 'react';
import PropTypes from 'prop-types';

const AccountTable = ({ accounts }) => {
  const [expandedAccounts, setExpandedAccounts] = useState({});

  const formatNumber = (number) => {
    const absoluteNumber = Math.abs(number);
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(absoluteNumber);
  };

  const getColorClass = (totalDebt) => {
    const absoluteDebt = Math.abs(totalDebt);
    if (absoluteDebt > 1000000) return 'bg-red-100';
    if (absoluteDebt > 500000) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const toggleExpand = (code) => {
    setExpandedAccounts((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const groupAccounts = (accounts) => {
    const grouped = {};
    accounts.forEach((account) => {
      const code = account.accountCode;
      const parts = code.split('.');
      const level1 = parts[0];
      const level2 = parts.length > 1 ? `${level1}.${parts[1]}` : null;
      const level3 = parts.length > 2 ? `${level2}.${parts[2]}` : null;

      if (!grouped[level1]) {
        grouped[level1] = {
          code: level1,
          totalDebt: 0,
          children: {},
        };
      }

      if (level2 && !grouped[level1].children[level2]) {
        grouped[level1].children[level2] = {
          code: level2,
          totalDebt: 0,
          children: {},
        };
      }

      if (level3) {
        grouped[level1].children[level2].children[level3] = {
          code: level3,
          totalDebt: Math.abs(account.totalDebt),
        };
        grouped[level1].children[level2].totalDebt += Math.abs(
          account.totalDebt,
        );
      } else if (level2) {
        grouped[level1].children[level2].totalDebt += Math.abs(
          account.totalDebt,
        );
      }
      grouped[level1].totalDebt += Math.abs(account.totalDebt);
    });

    return grouped;
  };

  const renderAccounts = (groupedAccounts) => {
    return Object.values(groupedAccounts).map((account) => (
      <div
        key={account.code}
        className="mb-6 rounded-lg shadow-lg overflow-hidden"
      >
        <div
          className={`p-4 flex justify-between items-center ${getColorClass(
            account.totalDebt,
          )} border-b-2 border-gray-200 cursor-pointer`}
          onClick={() => toggleExpand(account.code)}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {expandedAccounts[account.code] ? '−' : '+'}
            </span>
            <span className="font-bold text-lg">{account.code}</span>
            <span className="ml-4 text-gray-600">Ana Hesap</span>
          </div>
          <span className="font-bold text-lg">
            {formatNumber(account.totalDebt)}
          </span>
        </div>

        {expandedAccounts[account.code] &&
          account.children &&
          Object.values(account.children).map((child) => (
            <div key={child.code} className="border-l-4 border-blue-500">
              <div
                className="ml-4 p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(child.code)}
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    {expandedAccounts[child.code] ? '−' : '+'}
                  </span>
                  <span className="font-semibold">{child.code}</span>
                  <span className="ml-4 text-gray-500">Alt Hesap</span>
                </div>
                <span className="font-semibold">
                  {formatNumber(child.totalDebt)}
                </span>
              </div>

              {expandedAccounts[child.code] &&
                child.children &&
                Object.values(child.children).map((grandChild) => (
                  <div
                    key={grandChild.code}
                    className="ml-8 p-2 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <span>{grandChild.code}</span>
                      <span className="ml-4 text-gray-400">Detay</span>
                    </div>
                    <span>{formatNumber(grandChild.totalDebt)}</span>
                  </div>
                ))}
            </div>
          ))}
      </div>
    ));
  };

  const groupedAccounts = groupAccounts(accounts);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Hesap Kodu ve Borç Detayları
      </h2>
      <div className="space-y-4">{renderAccounts(groupedAccounts)}</div>
    </div>
  );
};

AccountTable.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      accountCode: PropTypes.string.isRequired,
      totalDebt: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default AccountTable;
