const mongoose=require('mongoose');
require('dotenv').config();

// console.log(process.env.mongoURI)
const mongoURI=process.env.mongoURI;
module.exports = function (callback) {
    mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        // mongoDbClient.connect(mongoURI, { useNewUrlParser: true }, async(err, result) => {
        if (err) console.log("---" + err)
        else {
            // var database =
            console.log("connected to Database")
            const foodCollection = await mongoose.connection.db.collection("Food Data");
            foodCollection.find({}).toArray(async function (err, data) {
                const foodCategory=await mongoose.connection.db.collection("Food Category")
                foodCategory.find({}).toArray(function(err,catData){
                    
                    if(err){
                        console.log(err)
                    }
                    else{
                        global.food_items=data;
                    global.foodCategory=catData;
                    }
                })
               
                
               
            });
            // listCollections({name: 'food_items'}).toArray(function (err, database) {
            // });
            //     module.exports.Collection = database;
            // });
        }
    })
};