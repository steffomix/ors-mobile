----
-- phpLiteAdmin database dump (https://bitbucket.org/phpliteadmin/public)
-- phpLiteAdmin version: 1.9.6
-- Exported: 10:49pm on March 25, 2016 (EET)
-- database file: ./DB.sqlite3
----
BEGIN TRANSACTION;

----
-- Table structure for projects
----
CREATE TABLE 'projects' ('id' INTEGER PRIMARY KEY NOT NULL, 'name' TEXT NOT NULL, 'start' DATETIME NOT NULL, 'end' DATETIME NOT NULL, 'info' TEXT);

----
-- Data dump for projects, a total of 3 rows
----
INSERT INTO "projects" ("id","name","start","end","info") VALUES ('1','First try
','2016-2-15 09:00:00','2016-3-8 09:00:00','YYYY-MM-DD HH:MM:SS');
INSERT INTO "projects" ("id","name","start","end","info") VALUES ('2','Second run','2016-3-1 09:00:00','2016-3-28 09:00:00','YYYY-MM-DD HH:MM:SS
Second');
INSERT INTO "projects" ("id","name","start","end","info") VALUES ('3','Finally success','2016-3-20 09:00:00','2016-4-15 09:00:00','');

----
-- Table structure for bookings
----
CREATE TABLE 'bookings' ('id' INTEGER PRIMARY KEY NOT NULL, 'project_id' INTEGER NOT NULL, 'article_id' INTEGER NOT NULL, 'booked' INTEGER DEFAULT 0 , 'returned' INTEGER DEFAULT 0 , 'damaged' INTEGER DEFAULT 'O', 'info' INTEGER);

----
-- Data dump for bookings, a total of 3 rows
----
INSERT INTO "bookings" ("id","project_id","article_id","booked","returned","damaged","info") VALUES ('1','1','1','10','8','O',NULL);
INSERT INTO "bookings" ("id","project_id","article_id","booked","returned","damaged","info") VALUES ('2','1','2','0','0','O',NULL);
INSERT INTO "bookings" ("id","project_id","article_id","booked","returned","damaged","info") VALUES ('3','2','3','5','0','O',NULL);

----
-- Table structure for chiefs
----
CREATE TABLE "chiefs" ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'name' TEXT NOT NULL, 'info' TEXT);

----
-- Data dump for chiefs, a total of 3 rows
----
INSERT INTO "chiefs" ("id","name","info") VALUES ('1','Mr. Brown','Pro for Huge Projects');
INSERT INTO "chiefs" ("id","name","info") VALUES ('2','Mrs. Yellow','Like her Coffee with Milk');
INSERT INTO "chiefs" ("id","name","info") VALUES ('3','Mr. Blue','Quick Projects only');

----
-- Table structure for articles
----
CREATE TABLE 'articles' ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'name' TEXT NOT NULL,'info' TEXT NOT NULL,'stock' INTEGER,'damaged' INTEGER, 'timeline' TEXT);

----
-- Data dump for articles, a total of 3 rows
----
INSERT INTO "articles" ("id","name","info","stock","damaged","timeline") VALUES ('1','Round Table','Its round',NULL,NULL,'');
INSERT INTO "articles" ("id","name","info","stock","damaged","timeline") VALUES ('2','Chair','Something to sit on',NULL,NULL,'');
INSERT INTO "articles" ("id","name","info","stock","damaged","timeline") VALUES ('3','Coffee Cup','Hmmm!',NULL,NULL,'');
COMMIT;
