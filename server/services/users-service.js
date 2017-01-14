const csv = require('csvtojson')
const fs = require('fs');
const loki = require('lokijs');

class Users{
  constructor() {
    const loadHandler = () => {
      // if database did not exist it will be empty so I will intitialize here
      this.usersCollection = this.db.getCollection('users');
      if (this.usersCollection === null) {
        this.usersCollection = this.db.addCollection('users');
      }
    }
    this.db = new loki('./uploads/loki.js', { 
      autoload: true, 
      autosave: true, 
      autoloadCallback: loadHandler
    });
  }

  isEmpty() {
    return Object.keys(this.usersCollection.findOne({})).length === 0;
  }

  parse(file) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file);
      csv({headers: ['id', 'name', 'age', 'address', 'team']})
        .fromStream(stream)
        .on('json', (jsonObj) => {
          this.save(jsonObj);
        })
        .on('done', (err) => {
          if(err) {
            console.error(err);
            return reject(err);
          }
          resolve();
        })
    });
  }

  save(row){
    this.usersCollection.insert(row);
  }

  search(text) {
    if (!text) {
      return [];
    }
    return this.usersCollection
      .chain()
      .find({
          '$or': [
            {'name': {'$regex': new RegExp(text, 'i')}},
            {'address': {'$regex': new RegExp(text, 'i')}},
            {'team': {'$regex': new RegExp(text, 'i')}}
          ]
      })
      .limit(20)
      .data()
      .map((item)=>{
        delete item['$loki'];
        delete item['meta'];
        return item;
      });
  }
}

module.exports = new Users;