const mongoose = require('mongoose');
const { mongodb/*, mongodb2*/ } = require('./keys');

mongoose.set('useFindAndModify', false);
mongoose.connect(mongodb.URI, {
  useNewUrlParser: true
})
  .then(db => console.log('conectado')) 
  .catch(err => console.log(err));


//-------  
/*mongoose.connect(mongodb2.URI,{
  useNewUrlParser: true
})
  .then(db=> console.log('si'))
  .catch(err => console.log(err));*/
