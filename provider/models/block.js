'use strict';

//Set up database
var mongo = require('../libraries/mongo.js');
var config = require('../config/config.js');



module.exports = () => {
    this.blocks = [];
	  this.last_known=0;
    return {
        init: ()=>{
            listLastBlocks(10).then((blocks)=>{
                this.last_known=blocks[0].number;
                this.blocks=blocks;
                console.log(blocks);
            });
        },
        update: () => {
            return new Promise((resolve, reject) => {
		    listNewBlocks(this.last_known, 10)
		    .then((blocks)=>{
			      this.blocks=blocks.concat(this.blocks);
            if(blocks[0]!==undefined)
                this.last_known=blocks[0].number;
            this.blocks=this.blocks.slice(0,10);
			      resolve(blocks);
		    });
            });
        },
        get: () => {
            return this.blocks
        }
    };
};

function listLastBlocks(number) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('block').find({orphan: 0}).sort({'number': -1}).limit(number).toArray((err,docs)=>{
                    if(err) throw Error(err.message);
                    else
                        resolve(docs);
                });
            });
    });
}
function listNewBlocks(last_known, number) {
    return new Promise((resolve,reject)=>{
        mongo.connect()
            .then((db)=>{
                db.collection('block').find({'number': {'$gt': last_known}, 'orphan': 0}).sort({'number': -1}).limit(number).toArray((err,docs)=>{
            if(err) throw Error(err.message);
            else
                resolve(docs);
        });
            });
    });
}

