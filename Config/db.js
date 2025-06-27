import mongoose from "mongoose";

const connectDb = async () => {
    try
    {
        const databaseName = "cloudgaia";
        await mongoose.connect(`mongodb+srv://php2dbvertex:wFis3rlkFHnJiC6E@laaagi.7ci9ixg.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Laaagi`,
             {}
    )
        console.log("database connected")
    } catch (error) {
        console.log(`Error ${error.message}`)
    }
}

export default connectDb;
