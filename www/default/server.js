var express = require('express'), // bring in the the express api
    fs = require('fs'), // bring in the file system api
    mustache = require('mustache'), // bring in mustache template engine
    app = express(), // create the http server w/express

    mongoose = require('mongoose'),

    demoData = [
        { // dummy data to display
            "name": "Steve Balmer",
            "company": "Microsoft",
            "systems": [
                {
                    "os": "Windows XP"
                },
                {
                    "os": "Vista"
                },
                {
                    "os": "Windows 7"
                },
                {
                    "os": "Windows 8"
                }
            ]

        },
        {
            "name": "Steve Jobs",
            "company": "Apple",
            "systems": [
                {
                    "os": "OSX Lion"
                },
                {
                    "os": "OSX Leopard"
                },
                {
                    "os": "IOS"
                }
            ]
        },
        {
            "name": "Mark Z.",
            "company": "Facebook"
        }
    ];


//Server-side initialization for public folder containing javascript files:
app.use(express.static('public'));

//Use mongoose to abstract the db's commands:
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

    /**
     * Declare then initialize the schema.
     * @type {Mongoose.Schema}
     */
    var zingChartSchema = new mongoose.Schema({
        id: String,
        data: {
            type: String,
            series : [{
                values : Array
            }]
        }
    });



    /**
     * Declare, initialize the model. Then bind values onto it.
     * @type {*|Model}
     */
    var apiData = mongoose.model('apiData', zingChartSchema);
    var entry = new apiData({
        id: "chart",
        data: {
            type: "line",
            series: [{ values: [5,10,15,5,10,5] }]
        }
    });


    /**
     * Save (update) the entry.
     */
    entry.save(function (err, entry) {
        if (err === null) { //Save success.

            /**
             * (demo): Ask the concrete model to perform a query.
             * @return Returns a single entry upon success, or an error upon failure.
             */
            var query = apiData.where({ id: 'chart' });
            query.findOne(function (err, res) {
                console.log('res is ' + res);
                return res;
            });

        } else {
            //Error handling here.
        }
    });

});

//app.get('/app/:slug', function(req, res){ // get the url and slug info

app.get('/:slug', function (req, res) { //  get the url and slug info

    var slug = [req.params.slug][0]; // grab the page slug
    var rData = {records: demoData}; // wrap the data in a global object... (mongo fix)

    var page = fs.readFileSync(slug, "utf8"); // bring in the HTML file
    var html = mustache.to_html(page, rData); // replace all of the data

    res.send(html); // send to client
});


app.listen(3000);// start the server listening
console.log('Server running at http://127.0.0.1:3000/'); // server start up message
