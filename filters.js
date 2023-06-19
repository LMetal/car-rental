var moment = require('moment');


exports.filterModels = function(models, req) {
    if(req.query.seats2 !== 'on') models = models.filter((m) => m.seats !== 2);
    //if(req.query.seats4 !== 'on') models = models.filter((m) => m.seats !== 4);
    if(req.query.seats5 !== 'on') models = models.filter((m) => m.seats !== 5);

    if(req.query.doors2 !== 'on') models = models.filter((m) => m.doors !== 2);
    if(req.query.doors4 !== 'on') models = models.filter((m) => m.doors !== 4);
    if(req.query.doors5 !== 'on') models = models.filter((m) => m.doors !== 5);

    models = models.filter((m) => m.cost <= req.query.maxPrice);

    return models;
}

exports.areValid = function (d1, d2){
    var date1 = moment(d1, 'YYYY-MM-DD');
    var date2 = moment(d2, 'YYYY-MM-DD');
    
    return date2.isAfter(date1) && date1.isAfter(moment().subtract(1, 'days'));
}