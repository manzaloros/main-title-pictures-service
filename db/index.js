const _ = require('underscore');
const faker = require('faker');
const mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mykea_main_title_pictures',
  multipleStatements: true
});

const seedText = () => {
  return new Promise(function (resolve, reject) {
    for (let i = 0; i < 100; i++) {
      let sentence = faker.lorem.sentence(30);
      let sql = 'INSERT INTO descriptions(description) VALUES(?)';
      connection.query(sql, [sentence], (err, results, fields) => {
        if (err) {
          console.error(err.message);
          return reject(err);
        }
        console.log('Descriptions table seeded. Affected rows:', results.affectedRows);
        resolve(results);
      });
    }
  });
};

const seedPictures = () => {
  new Promise(function (resolve, reject) {
    // Array of urls
    let urlString = 'https://mykea-main-title-pictures.s3.us-east-2.amazonaws.com/';
    let urlsArray = _.range(1, 36).map(number => `${urlString}${String(number).padStart(2, '0')}.jpg`);

    // Add 600 picture urls randomly to table
    for (let i = 1; i < 601; i++) {
      let sql = 'INSERT INTO pictures(url, description_id) VALUES(?, ?)';
      let randomURL = urlsArray[Math.floor(Math.random() * urlsArray.length)];

      // Gives number between 1 and 6
      let descriptionCounter = Math.floor((Math.random() * 100) + 1);

      connection.query(sql, [randomURL, descriptionCounter], (err, results) => {
        if (err) {
          return console.error(err.message);
          return reject(err);
        }
        console.log('Pictures table seeded. Affected rows: ', results.affectedRows);
        resolve(results);
      });
    }
  });
};

const dropDB = () => {
  return new Promise(function (resolve, reject) {
    const sql = 'DROP DATABASE IF EXISTS mykea_main_title_pictures';
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(results);
      resolve(results);
    });
  });
};

const createDB = () => {
  new Promise(function (resolve, reject) {
    const sql = 'CREATE DATABASE mykea_main_title_pictures';
    connection.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const useDB = () => {
  new Promise(function (resolve, reject) {
    const sql = 'USE mykea_main_title_pictures';
    connection.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const createDescriptions = () => {
  new Promise(function (resolve, reject) {
    const sql = `CREATE TABLE descriptions (
      id INT NOT NULL AUTO_INCREMENT,
      description VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    )`;
    connection.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const createPictures = () => {
  new Promise(function (resolve, reject) {
    const sql = `CREATE TABLE pictures (
      id INT NOT NULL AUTO_INCREMENT,
      url TEXT,
      description_id INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (description_id) REFERENCES descriptions (id)
    )`;
    connection.query(sql, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Seed DB
seedText()
  .then(results => seedPictures())
  .then(results => connection.end())
  .catch(err => console.log(err));