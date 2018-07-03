'use strict';

//Set up database
var mongo = require('../libraries/mongo.js');
var config = require('../config/config.js');
var mongodb = require('mongodb');
var ObjectId = mongodb.ObjectID;



module.exports = () => {
    this.txs = [];
	  this.last_id= "0";
    return {
        init: ()=>{
            listLastBlocks(10).then((txs)=>{
                this.last_id=txs[0]._id;
                this.txs=txs;
            });
        },
        update: () => {
            return new Promise((resolve, reject) => {
		    listNewBlocks(this.last_id)
		    .then((txs)=>{
			      this.txs=txs.concat(this.txs);
            if(txs[0]!==undefined)
                this.last_id=txs[0]._id;
            this.txs=this.txs.slice(0,10);
			      resolve(txs);
		    });
            });
        },
        get: () => {
            return this.txs;
        }
    };
};

function listLastBlocks(number) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('tx').find().sort({'height': -1}).limit(number).toArray((err,docs)=>{
                    if(err) throw Error(err.message);
                    else
                        resolve(docs);
                });
            });
    });
}
function listNewBlocks(last_id) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('tx').find({'_id': {'$gt': new ObjectId(last_id)}}).sort({'_id': -1}).toArray((err,docs)=>{
            if(err) throw Error(err.message);
            else
                resolve(docs);
        });
            });
    });
}

