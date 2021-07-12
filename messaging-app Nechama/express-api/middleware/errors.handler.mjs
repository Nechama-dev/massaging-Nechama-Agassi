const { NODE_ENV } = process.env;

export const error_handler =  (err, req, res, next) => {
    console.log(err);
    if(NODE_ENV === 'development')res.status(500).json({status:err.message,stack:err.stack});
    else res.status(500).json({status:'internal server error...'});
}



export const not_found =  (req, res) => {
    console.log(`url: ${req.url} not found...`);
    res.status(404).json({status:`url: ${req.url} not found...`});
}

