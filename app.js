
const http = require('http')
const port = 8080
  
// Create a server object:

const readline = require('readline-sync');

let query = readline.question("Query: ");

const server = http.createServer(function (req, res) {
    res.write('Query: '+query);
    res.end()
})
 
server.listen(port, function (error) {

    const exec = require('child_process').exec;
    const child = exec('python3 download_images.py bin '+query,
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
    if (error)
        console.log('Something went wrong', error);
    else
        console.log('Server is listening on port' + port);
})

