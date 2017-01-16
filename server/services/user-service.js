const csv = require('csvtojson')
const fs = require('fs');
const loki = require('lokijs');

class UserService{
  initDb() {
    const loadHandler = () => {
      // if database did not exist it will be empty so I will intitialize here
      this.usersCollection = this.db.getCollection('users');
      if (this.usersCollection === null) {
        this.usersCollection = this.db.addCollection('users', {unique: "id"});
      }
    }
    this.db = new loki(this.dbFile, { 
      autoload: true, 
      autosave: true, 
      autoloadCallback: loadHandler
    });
  }

  constructor() {
    this.dbFile = './uploads/loki.js';
    this.initDb()
  }

  isEmpty() {
    return Object.keys(this.usersCollection.findOne({})).length === 0;
  }

  getAmountOfLines(file) {
    return new Promise((resolve, reject) => {
      const exec = require('child_process').exec;
      exec('wc -l ' + file, (err, stdout) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(parseInt(stdout.trim().split(' ')[0]));
      });
    });
  }

  getParsingProgress(file) {
    return this.getAmountOfLines(file).then((totalAmountOfLines)=>{
      return () => {
        let parsedAmountOfLines = this.usersCollection.count();
        let percentage = parsedAmountOfLines / (totalAmountOfLines / 100);
        return {
          progress: Math.round(percentage),
          totalAmountOfLines,
          parsedAmountOfLines
        };
      }
    })
  }

  parse(file) {
    return this.clear().then(()=>{
      return this._parse(file);
    })
  }

  _parse(file) {
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

  clear(){
    return new Promise((resolve) => {
      fs.unlink(this.dbFile, (err) => {
        if (err) {
          console.error(err.code === 'ENOENT' ? 'DB is not created yet' : err);
        };
        this.initDb();
        resolve()
      });
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

module.exports = new UserService;