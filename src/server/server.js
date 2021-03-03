let express = require('express');
const path = require('path')
let app = express();

console.log('Build Contents Path : ',path.join(__dirname, '/../../public'));
//app.use(express.static(__dirname+'\\..\\..\\static'));
app.use(express.static(path.join(__dirname, '/../../public')));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '/../../public', 'index.html'));
})

let server = app.listen(4000, ()=>{
    console.log(`Server started listening on 4000`);
});