const { app } = require('@azure/functions');
const nodemailer = require("nodemailer");

const BTCADDRESSTOMONITOR = process.env.BTCAddressToMonitor;

const EMAILHOST = process.env.eMailHost;
const EMAILUSERNAME = process.env.eMailUserName;
const EMAILPASSWORD = process.env.eMailPassword;
const EMAILFROM = process.env.eMailFrom;
const EMAILTO = process.env.eMailTo;

app.timer('addressBalanceChangeNotifier', {
    schedule: '0 0 5 * * *',//Run whenever the seconds are at 0, the minutes are at 0 and the hour is 05:00 UTC
    handler: async (myTimer, context) => {
        // context.log('The Timer function has started.');
        //Get address balance
        await getBalance();
        async function getBalance() {
            const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${BTCADDRESSTOMONITOR}`);
            const addressData = await response.json();
            // context.log(addressData);

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
                        <td style="border-left: 1px solid black;padding: 5px;">${datesAndBalancesOflast2Transactions[1].balance / 1e8} BTC</td>
                        <td style="border-left: 1px solid black;padding: 5px;">${datesAndBalancesOflast2Transactions[0].balance / 1e8} BTC</td>
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