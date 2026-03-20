export const createPayment = (tx: any, data: any) => {
  return tx.payments.create({ data });
};