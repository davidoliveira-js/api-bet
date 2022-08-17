module.exports = {
  convertCurrency(price) {
    let amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      useGrouping: false,
    }).format(price / 100);
    amount = amount.replace('R$', '').trim().replace(',', '.');
    return amount;
  },
};
