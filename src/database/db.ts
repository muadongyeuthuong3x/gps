import mongoose, { Connection } from 'mongoose';
import winstonLogger from "../winston/winstonLogger";

class Database {
    private static instance: Database;
    private connection: Connection | null = null; 
    async connect(uri : string) {
        if(this.connection){
            return this.connection;
        }
        try {
         await mongoose.connect(uri);
            this.connection = mongoose.connection;
            // this.connection.once('open', () => {
            //     winstonLogger.info("Connect success");
            // });
            this.connection.on('error', (error) => {
                winstonLogger.error("Connection error:", error);
            });
        } catch (error) {
          winstonLogger.error(error) 
          throw error;
        }

        return this.connection;
    }
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

export default Database;