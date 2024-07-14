# Tamper Proof Data

I implemented a simple blockchain algorithm to make this data immutable. Using this method, even if the data is changed directly in the database, it is possible to detect this change through the hashes of the blocks, and with the backup it is possible to recover the entire blockchain.

I've used mock data, but in the real world security layers (like authentication and secure key hashes) would obviously be implemented and the backup would be on some secure cloud platform or datacenter.

**1. How does the client ensure that their data has not been tampered with?**
</br>
a. The client can consult the blockchain's verification route at any time to check the integrity of the data.
</br>
**2. If the data has been tampered with, how can the client recover the lost data?**
</br>
a. Whenever a new block is created when the user updates the data (or periodically), the entire blockchain will be backed up and the user can restore it using the backup.

The implementation is simple but answers the questions by keeping the data immutable and secure against intrusions into the database and server.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
