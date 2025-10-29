# Lab - 7 Reflection
> The primary goal of this lab is to build a client-side, mock document database that runs entirely in the browser. This 
database mimics the API style of MongoDB and is designed to be storage-agnostic for all data operations (Create, 
Read, Update, Delete), meaning the application code that uses the database doesn't need to know how or where the 
data is stored.  Important to note, because this database is strictly client-side, all data should be treated as public.

## My reflection
This lab walked me through how databases are configured in the browser. Seeing the demos really helped solidify my understanding of databases in web development. The lab also showed me how to configure basic database CRUD operations (insertOne(), findOne/Many(), updateOne(), deleteOne()) as well as more advanced ones (findManyBy(), findOneBy(), find(), updateOneOps(), upsertOne(), transact).

I also learned how adapter contracts work, making it easier to swap between different types of databases. This helped me understand how data flows between clients and servers using HTTP requests to access data.