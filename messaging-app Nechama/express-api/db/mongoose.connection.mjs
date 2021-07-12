import mongoose from 'mongoose'

export const connect_db = async uri => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    await mongoose.connect(uri,options)
    console.log(' Connected to Mongo DB ')
}