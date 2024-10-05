const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL ;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


const initDB = async () => {
    try {
      await Listing.deleteMany({});
      initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "66ee5e3fcf85f877a6983264",
      }));
      await Listing.insertMany(initData.data);
      console.log("data saved");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };
  

initDB();
