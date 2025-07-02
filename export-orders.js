require('dotenv').config();
const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const PUBLIC_KEY = process.env.TILDA_PUBLIC_KEY;
const SECRET_KEY = process.env.TILDA_SECRET_KEY;

async function exportOrders() {
  try {

    const url = `https://api.tildacdn.info/v1/getprojectslist/?publickey=${PUBLIC_KEY}&secretkey=${SECRET_KEY}`;
    const response = await axios.get(url);
    const orders = response.data.result;


    let rows = [];
    orders.forEach(order => {
      const orderId = order.orderid;
      const customer = order.name || '';
      (order.items || []).forEach(item => {
        rows.push({
          orderId,
          customer,
          productName: item.title,
          quantity: item.quantity,
          price: item.price
        });
      });
    });


    const csvWriter = createCsvWriter({
      path: 'orders.csv',
      header: [
        {id: 'orderId', title: 'OrderID'},
        {id: 'customer', title: 'Customer'},
        {id: 'productName', title: 'ProductName'},
        {id: 'quantity', title: 'Quantity'},
        {id: 'price', title: 'Price'}
      ]
    });

    await csvWriter.writeRecords(rows);
    console.log('Выгрузка завершена! Файл orders.csv создан.');
  } catch (error) {
    console.error('Ошибка экспорта:', error.message);
  }
}

exportOrders();


