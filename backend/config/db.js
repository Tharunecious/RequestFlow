const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected successfully"
        );
    } catch (error) {
    console.error(
        "FULL DATABASE ERROR:"
    );

    console.error(error);

    console.log(
        "MONGODB_URI:",
        process.env.MONGODB_URI
    );

    process.exit(1);
}
};

module.exports = {
    connectDB,
};