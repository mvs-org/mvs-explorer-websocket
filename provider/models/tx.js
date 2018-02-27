'use strict';

//Set up database
var mongo = require('../libraries/mongo.js');
var config = require('../config/config.js');

module.exports = () => {
    this.txs = [];
	  this.last_known=0;

    return {
        init: ()=>{
            listLastTxs(10).then((txs)=>{
                this.last_known=txs[0].number;
                this.txs=txs;
            });
        },
        update: () => {
            return new Promise((resolve, reject) => {
		    listNewTxs(this.last_known, 10)
		    .then((txs)=>{
            txs.forEach((tx)=>{
                if(tx.id>this.txs[this.txs.length-1].id)
                    this.txs.push(tx);
            });
            this.last_known=this.txs[this.txs.length-1].id;
            this.txs=this.txs.slice(0,10);
			      resolve(txs);
		    });
            });
        },
        get: () => this.txs
    };
};

function listLastTxs(number) {
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
function listNewTxs(last_known, number) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('tx').find({'id': {'$gt': last_known}}, {inputs: 0, outputs: 0, _id:0}.sort({'id', -1}).limit(number).toArray((err,docs)=>{
            if(err) throw Error(err.message);
            else
                resolve(docs);
        });
            });
    });
}
