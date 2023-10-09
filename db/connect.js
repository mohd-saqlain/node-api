const mongoose = require('mongoose')

const url = 'mongodb+srv://saqlainaly:w59rhThu4142wuAs@cluster0.nixfrcw.mongodb.net/Cluster0'

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res=>console.log("Mongo Connected")).catch(err=>console.log(err))
