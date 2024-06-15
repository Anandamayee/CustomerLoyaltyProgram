import { Module } from "@nestjs/common";
import mongoose from "mongoose";


const uri = "mongodb+srv://anandamayeenanda:AndyMongoDb@225@cluster0.pq8meww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory:():Promise<typeof mongoose> =>
            mongoose.connect(uri)
    }
]
@Module({
    providers:[...databaseProviders],
    exports:[...databaseProviders]
})

export class DatabaseModule{}