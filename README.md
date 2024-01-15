# Address balance change notifier (Work-in-progress, not done yet)
A Node.js Azure Function has been implemented to function as a timer, executing at specified intervals. This function monitors the balance of a Bitcoin address and triggers an email notification if the balance deviates from the expected value.

# Configuration Variables
To customize the functionality, you may adjust the following private variables:

- **Address to Monitor:** Specify the Bitcoin address for monitoring.
- **Baseline Balance:** Set the initial balance, which should match the current balance of the specified address.
- **Email Credentials:** Provide the email address and password for programmatic email notifications.