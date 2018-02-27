module.exports={
    task: ( process.env.PROVIDE_TASK ) ? process.env.PROVIDE_TASK : 'TRANSACTIONS',
    timer:{
        transactions: ( process.env.TRANSACTION_TIMER ) ? process.env.TRANSACTION_TIMER : 1000,
        blocks: ( process.env.BLOCK_TIKER ) ? process.env.TRANSACTION_TIMER : 1000,
    }
};
