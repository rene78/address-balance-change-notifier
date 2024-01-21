const { app } = require('@azure/functions');
const nodemailer = require("nodemailer");

const BTCADDRESSTOMONITOR = process.env.BTCAddressToMonitor;
const BTCBASELINEBALANCE = process.env.BTCBaselineBalance;

const EMAILHOST = process.env.eMailHost;
const EMAILUSERNAME = process.env.eMailUserName;
const EMAILPASSWORD = process.env.eMailPassword;
const EMAILFROM = process.env.eMailFrom;
const EMAILTO = process.env.eMailTo;

app.timer('addressBalanceChangeNotifier', {
    schedule: '* * 2 * * *',//Run whenever the hour finger is at 02:00 UTC
    handler: async (myTimer, context) => {
        // context.log('The Timer function has started.');
        //Get address balance
        await getBalance();
        async function getBalance() {
            const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${BTCADDRESSTOMONITOR}`);
            const addressData = await response.json();
            // context.log(addressData);
            // const addressData = {
            //     "address": "tb1qfz046rg7g2agakg9paxcw3hnmwnhtjdrfkzefy",
            //     "total_received": 3931507,
            //     "total_sent": 2557195,
            //     "balance": 1374312,
            //     "unconfirmed_balance": 0,
            //     "final_balance": 1374312,
            //     "n_tx": 10,
            //     "unconfirmed_n_tx": 0,
            //     "final_n_tx": 10,
            //     "txrefs": [
            //         {
            //             "tx_hash": "8dfe6965fb0aa10f9ca9af027a0b345c8c4ea169c5f8c209a1dff2a372aa2aa2",
            //             "block_height": 2574158,
            //             "tx_input_n": -1,
            //             "tx_output_n": 44,
            //             "value": 1000,
            //             "ref_balance": 1374312,
            //             "spent": false,
            //             "confirmations": 262,
            //             "confirmed": "2024-01-21T00:01:01Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "a5a8ed3df3a83eb250b747f9d7e2975a863ff4b01ee2585596bce63a24ac6a15",
            //             "block_height": 2573651,
            //             "tx_input_n": -1,
            //             "tx_output_n": 35,
            //             "value": 1000,
            //             "ref_balance": 1373312,
            //             "spent": false,
            //             "confirmations": 769,
            //             "confirmed": "2024-01-17T16:55:03Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "745de752e4698314b52e4f6a2ee55c4c75d6586842665d76320c9816320653d2",
            //             "block_height": 2573644,
            //             "tx_input_n": 0,
            //             "tx_output_n": -1,
            //             "value": 1051190,
            //             "ref_balance": 1372312,
            //             "confirmations": 776,
            //             "confirmed": "2024-01-17T16:20:25Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "745de752e4698314b52e4f6a2ee55c4c75d6586842665d76320c9816320653d2",
            //             "block_height": 2573644,
            //             "tx_input_n": -1,
            //             "tx_output_n": 3,
            //             "value": 549951,
            //             "ref_balance": 2423502,
            //             "spent": false,
            //             "confirmations": 776,
            //             "confirmed": "2024-01-17T16:20:25Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "e1fd99126c4ab7d16e969681dbdfcaa1da3fd9ea2faa2ca537dd3ee4a62954a9",
            //             "block_height": 2572857,
            //             "tx_input_n": 0,
            //             "tx_output_n": -1,
            //             "value": 1420218,
            //             "ref_balance": 1873551,
            //             "confirmations": 1563,
            //             "confirmed": "2024-01-14T21:43:59Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "e1fd99126c4ab7d16e969681dbdfcaa1da3fd9ea2faa2ca537dd3ee4a62954a9",
            //             "block_height": 2572857,
            //             "tx_input_n": -1,
            //             "tx_output_n": 3,
            //             "value": 418979,
            //             "ref_balance": 3293769,
            //             "spent": false,
            //             "confirmations": 1563,
            //             "confirmed": "2024-01-14T21:43:59Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "671e0dbee53f6a31f4cd2d32c00ac06ebd0f6ab30b642d61778444d8b17f5cac",
            //             "block_height": 2572807,
            //             "tx_input_n": -1,
            //             "tx_output_n": 0,
            //             "value": 1420218,
            //             "ref_balance": 2874790,
            //             "spent": true,
            //             "spent_by": "e1fd99126c4ab7d16e969681dbdfcaa1da3fd9ea2faa2ca537dd3ee4a62954a9",
            //             "confirmations": 1613,
            //             "confirmed": "2024-01-14T10:29:17Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "080182d7e5baab6f18fd4d4a4c602b90c64c4fc70490a2914a70882eb60b96d2",
            //             "block_height": 2572453,
            //             "tx_input_n": 0,
            //             "tx_output_n": -1,
            //             "value": 1102429,
            //             "ref_balance": 1454572,
            //             "confirmations": 1967,
            //             "confirmed": "2024-01-11T21:23:38Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "080182d7e5baab6f18fd4d4a4c602b90c64c4fc70490a2914a70882eb60b96d2",
            //             "block_height": 2572453,
            //             "tx_input_n": -1,
            //             "tx_output_n": 3,
            //             "value": 1051190,
            //             "ref_balance": 2557001,
            //             "spent": true,
            //             "spent_by": "745de752e4698314b52e4f6a2ee55c4c75d6586842665d76320c9816320653d2",
            //             "confirmations": 1967,
            //             "confirmed": "2024-01-11T21:23:38Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "c7d75a615541bda596ef2c482910ce11a5a595dee7da77bc88792dabb55e232c",
            //             "block_height": 2572453,
            //             "tx_input_n": 0,
            //             "tx_output_n": -1,
            //             "value": 1404621,
            //             "ref_balance": 1505811,
            //             "confirmations": 1967,
            //             "confirmed": "2024-01-11T21:23:38Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "c7d75a615541bda596ef2c482910ce11a5a595dee7da77bc88792dabb55e232c",
            //             "block_height": 2572453,
            //             "tx_input_n": -1,
            //             "tx_output_n": 3,
            //             "value": 403382,
            //             "ref_balance": 2910432,
            //             "spent": false,
            //             "confirmations": 1967,
            //             "confirmed": "2024-01-11T21:23:38Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "42c9343bdda14b6c385008f0b04a0c78e5c054953e45dbca40a679fb8c5be415",
            //             "block_height": 2572353,
            //             "tx_input_n": -1,
            //             "tx_output_n": 1,
            //             "value": 1404621,
            //             "ref_balance": 2507050,
            //             "spent": true,
            //             "spent_by": "c7d75a615541bda596ef2c482910ce11a5a595dee7da77bc88792dabb55e232c",
            //             "confirmations": 2067,
            //             "confirmed": "2024-01-11T10:01:02Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "99a11f53c8f3925e8a3ec57a3a059bbba90cdb7da712d98887d6c588450f53a5",
            //             "block_height": 2572351,
            //             "tx_input_n": 0,
            //             "tx_output_n": -1,
            //             "value": 1104668,
            //             "ref_balance": 1102429,
            //             "confirmations": 2069,
            //             "confirmed": "2024-01-11T09:45:17Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "99a11f53c8f3925e8a3ec57a3a059bbba90cdb7da712d98887d6c588450f53a5",
            //             "block_height": 2572351,
            //             "tx_input_n": -1,
            //             "tx_output_n": 3,
            //             "value": 1102429,
            //             "ref_balance": 2207097,
            //             "spent": true,
            //             "spent_by": "080182d7e5baab6f18fd4d4a4c602b90c64c4fc70490a2914a70882eb60b96d2",
            //             "confirmations": 2069,
            //             "confirmed": "2024-01-11T09:45:17Z",
            //             "double_spend": false
            //         },
            //         {
            //             "tx_hash": "09673bb0df33e9f6f5dc3921ea28767c6e03f49d98f27a9bbcbe1ec39c67480a",
            //             "block_height": 2572351,
            //             "tx_input_n": -1,
            //             "tx_output_n": 0,
            //             "value": 1104668,
            //             "ref_balance": 1104668,
            //             "spent": true,
            //             "spent_by": "99a11f53c8f3925e8a3ec57a3a059bbba90cdb7da712d98887d6c588450f53a5",
            //             "confirmations": 2069,
            //             "confirmed": "2024-01-11T09:45:17Z",
            //             "double_spend": false
            //         }
            //     ],
            //     "tx_url": "https://api.blockcypher.com/v1/btc/test3/txs/"
            // }
            //Check if a new transaction has happened within the last 2 days. If yes: Send out e-mail.
            const dateOfLatestTransactionAsString = addressData.txrefs[0].confirmed;
            // const dateOfLatestTransactionString = "2024-01-20T13:00:00";
            const dateOfLatestTransactionAsDate = Date.parse(dateOfLatestTransactionAsString);//Parsed into machine readable Date format
            const currentDate = new Date();//Create variable with current date

            const deltaMilliseconds = currentDate - dateOfLatestTransactionAsDate;//Calculate delta between time of last transaction and now.

            // Calculate from milliseconds to minutes, hours, days or years
            const minutes = 1000 * 60;
            const hours = minutes * 60;
            const days = hours * 24;
            const years = days * 365;

            const deltaDays = Math.round(deltaMilliseconds / days);//Convert from milliseconds to days

            //Balance has changed in the last 2 days. Send out E-mail notification
            if (deltaDays <= 2) {
                context.log('Balance has changed in the last 2 days');
                //Create an object with all relevant information for the E-mail
                const datesAndBalancesOflast2Transactions = [
                    { "balance": addressData.txrefs[0].ref_balance, "date": addressData.txrefs[0].confirmed },
                    { "balance": addressData.txrefs[1].ref_balance, "date": addressData.txrefs[1].confirmed }
                ];
                //Send out E-mail
                await sendMail(datesAndBalancesOflast2Transactions);
            }
            else context.log('Balance has not changed in the last 2 days. No E-mail is sent.');
        }

        // Send E-Mail once balance has changed
        async function sendMail(datesAndBalancesOflast2Transactions) {
            context.log('Sending email...'); 

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: EMAILHOST,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: EMAILUSERNAME,// email username
                    pass: EMAILPASSWORD // email password
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: EMAILFROM, // sender address
                to: EMAILTO, // list of receivers
                subject: "The balance of your monitored Bitcoin address has changed", // Subject line
                html: `
                <p>Hello,</p>
                <p>the balance of your monitored Bitcoin address <a
                    href="https://mempool.space/de/address/${BTCADDRESSTOMONITOR}" target="_blank"
                    rel="noopener noreferrer">${BTCADDRESSTOMONITOR}</a> has changed:</p>
                <table style="border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid black;">
                        <th></th>
                        <th style="border-left: 1px solid black;">Old</th>
                        <th style="border-left: 1px solid black;">New</th>
                    </tr>
                    <tr style="border-bottom: 1px solid black;">
                        <td style="padding: 5px;">Balance</td>
                        <td style="border-left: 1px solid black;padding: 5px;">${datesAndBalancesOflast2Transactions[1].balance/1e8} BTC</td>
                        <td style="border-left: 1px solid black;padding: 5px;">${datesAndBalancesOflast2Transactions[0].balance/1e8} BTC</td>
                    </tr>
                    <tr style="border-bottom: 1px solid black;">
                        <td style="padding: 5px;">Transaction Date</td>
                        <td style=" border-left: 1px solid black;padding: 5px;">${datesAndBalancesOflast2Transactions[1].date}</td>
                        <td style=" border-left: 1px solid black;padding: 5px;">${datesAndBalancesOflast2Transactions[0].date}</td>
                    </tr>` // html body
            });

            context.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        }
    }
});