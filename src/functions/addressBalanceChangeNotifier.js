const { app } = require('@azure/functions');

const temp = process.env.temp;

app.timer('addressBalanceChangeNotifier', {
    schedule: '0 */1 * * * *',
    handler: async (myTimer, context) => {
        context.log('Timer function started.');
        context.log('This is temp variable: ' + temp);
        //Get address balance
        await getAvailability();
        async function getAvailability() {
            // const response = await fetch("https://api.blockcypher.com/v1/btc/test3/addrs/tb1qfz046rg7g2agakg9paxcw3hnmwnhtjdrfkzefy/balance");
            // const addressData = await response.json();
            // context.log(addressData);
            const addressData = {
                "address": "tb1qfz046rg7g2agakg9paxcw3hnmwnhtjdrfkzefy",
                "total_received": 2509289,
                "total_sent": 1054717,
                "balance": 1454571,
                "unconfirmed_balance": 0,
                "final_balance": 1454571,
                "n_tx": 5,
                "unconfirmed_n_tx": 0,
                "final_n_tx": 5
            }

            if (addressData.balance !== 1454572) context.log('balance has changed from 1454572 to: ' + addressData.balance);
            else context.log('balance has not changed. It is still 1454572');
        }
    }
});