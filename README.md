# Address Balance Change Notifier
This script monitors the balance of a Bitcoin address every 24 hours and triggers an email notification if the balance has changed in the last 2 days. This Node.js script has been written to work on Microsofts Functions-as-a-Service (FaaS) offering, specifically [Azure Functions Timer Trigger](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer). Rewriting it for a vanilla Node.js backend shouldn't require much effort though. Just implement a ```setIntervall()``` method to call the function at specific time intervalls.

# Configuration Variables
To customize the functionality, you may adjust the following private variables in a ```local.settings.json``` file:

- **"BTCAddressToMonitor":** Bitcoin address to monitor, e.g. `bc1q3vdf3np392k28hze3zjffk4mk2ka8z9r593jxn`
- **"eMailHost":** Your email host, e.g. `smtp.office365.com`
- **"eMailUserName":** Your email address, e.g. `john.doe@outlook.com`
- **"eMailPassword":** Email password, e.g. `password123`
- **"eMailFrom":** Text that appears in the from field of the email, e.g. `'John Doe' <john.doe@outlook.com>`
- **"eMailTo":** The email address to which the notification mail is sent, e.g. `max.mustermann@gmail.com`

Here is an example of such a ```local.settings.json``` file

```
{
  "IsEncrypted": false,
  "Values": {
    "BTCAddressToMonitor": "bc1q3vdf3np392k28hze3zjffk4mk2ka8z9r593jxn",
    "eMailHost": "smtp.office365.com",
    "eMailUserName": "john.doe@outlook.com",
    "eMailPassword": "password123",
    "eMailFrom": "'John Doe' <john.doe@outlook.com>",
    "eMailTo": "max.mustermann@gmail.com"
  }
}
```