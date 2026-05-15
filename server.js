require('dotenv').config();
const dns = require('dns');
    
 dns.setServers([ '8.8.8.8', '1.1.1.1', ])

const app = require("./src/app");

const connectDB = require("./src/config/db");

const createAdmin = require("./src/service/createAdmin");

async function startServer() {

    try {

        await connectDB();

           await createAdmin();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {

            console.log(`server is running on ${PORT}`);
        });

    } catch (error) {

        console.log(error);
    }
}

startServer();