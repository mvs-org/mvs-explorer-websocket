'use strict';

//Set up database
var mongo = require('../libraries/mongo.js');
var config = require('../config/config.js');



module.exports = () => {
    this.txs = [];
	  this.last_known=0;
    return {
        init: ()=>{
            listLastBlocks(10).then((txs)=>{
                this.last_known=txs[0].id;
                this.txs=txs;
            });
        },
        update: () => {
            return new Promise((resolve, reject) => {
		    listNewBlocks(this.last_known)
		    .then((txs)=>{
			      this.txs=txs.concat(this.txs);
            if(txs[0]!==undefined)
                this.last_known=txs[0].id;
            this.txs=this.txs.slice(0,10);
			      resolve(txs);
		    });
            });
        },
        get: () => {
            return this.txs
        }
    };
};

function listLastBlocks(number) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('tx').find().sort({'id': -1}).limit(number).toArray((err,docs)=>{
                    if(err) throw Error(err.message);
                    else
                        resolve(docs);
                });
            });
    });
}
function listNewBlocks(last_known) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('tx').find({'id': {'$gt': last_known}}).sort({'id': -1}).toArray((err,docs)=>{
            if(err) throw Error(err.message);
            else
                resolve(docs);
        });
            });
    });
}

