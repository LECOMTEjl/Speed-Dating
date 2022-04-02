# BACK

## DAO : 
> ### Users : 
> "id"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
> "firstName"	TEXT NOT NULL,
> "lastName"	TEXT NOT NULL,
> "birthday"	TEXT NOT NULL,
> "email"	    TEXT NOT NULL UNIQUE,
> "pseudo"	    TEXT NOT NULL,
> "password"	TEXT NOT NULL,

> ### Comments : 
> "id"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
> "idSender"	INTEGER NOT NULL FOREIGN KEY,
> "idReceiver"	INTEGER NOT NULL FOREIGN KEY,
> "message"	    TEXT NOT NULL,

> ### Rates : 
> "id"	        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
> "idSender"	INTEGER NOT NULL FOREIGN KEY,
> "idReceiver"	INTEGER NOT NULL FOREIGN KEY,
> "idComment"   INTEGER FOREIGN KEY,
> "rate"	    INTEGER NOT NULL,

