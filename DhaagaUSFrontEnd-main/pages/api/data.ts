import ClientPromise from "../../server/mongodb";

import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

// const jsonRawData = require("../../data.json");
// const xlsxj = require("xlsx-to-json");
const restaurantsData = require("../../xlsxToJson/restaurants.json");
const groceryData = require("../../xlsxToJson/grocery.json");
const hennaData = require("../../xlsxToJson/henna.json");
const clothingData = require("../../xlsxToJson/clothing.json");
const salonData = require("../../xlsxToJson/salon.json");
const jewelryData = require("../../xlsxToJson/jewelry.json");

type Data = {
  name: string;
};
type day = {
  open: string;
  close: string;
};
type StringArray = {
  Monday?: day[];
};

// functions for seeding working_hours from google data to dhaaga db --START--
// const splitFunction = (data: any, seperator: string, array = false) => {
//   return array
//     ? data.map((item: any) => item.split(seperator))
//     : data.split(seperator);
// };

// const convertTimeInto24HoursFormat = (time: string) => {
//   let convertedTime = "";
//   const splitTime = splitFunction(time, " ", false);
//   const splitTimeDigitWithColon = splitFunction(splitTime[0], ":", false);
//   const hoursInt = parseInt(splitTimeDigitWithColon[0]);
//   const minutes = splitTimeDigitWithColon[1] || "00";
//   if (splitTime[1] === "AM") {
//     if (hoursInt === 12) {
//       convertedTime = `00:${minutes}`;
//     } else if (hoursInt < 10) {
//       convertedTime = `0${splitTimeDigitWithColon[0]}:${minutes}`;
//     } else if (hoursInt === 10 || hoursInt === 11) {
//       convertedTime = `${splitTimeDigitWithColon[0]}:${minutes}`;
//     }
//   } else if (splitTime[1] === "PM") {
//     if (hoursInt === 12) {
//       convertedTime = `12:${minutes}`;
//     } else if (hoursInt < 12) {
//       const hours = (hoursInt + 12).toString();
//       convertedTime = `${hours}:${minutes}`;
//     }
//   }
//   return convertedTime;
// };

// const checkIfAmOrPmAvailableAndReturnTimeAccordingly = (
//   spanOfTheDay: string[]
// ) => {
//   const spanTo = splitFunction(spanOfTheDay[1], " ", false);
//   let spanObject = { open: "", close: "" };

//   if (!spanOfTheDay[0].includes("AM") || !spanOfTheDay[0].includes("PM")) {
//     const firstSpanFromWithAmOrPm = `${spanOfTheDay[0]} ${spanTo[1]}`;
//     const convertedTime = convertTimeInto24HoursFormat(firstSpanFromWithAmOrPm);
//     spanObject.open = convertedTime;
//   } else if (spanOfTheDay[0].includes("AM") || spanOfTheDay[0].includes("PM")) {
//     const convertedTime = convertTimeInto24HoursFormat(spanOfTheDay[0]);
//     spanObject.open = convertedTime;
//   }

//   const convertedTime = convertTimeInto24HoursFormat(spanOfTheDay[1]);
//   spanObject.close = convertedTime;

//   return spanObject;
// };

// functions for seeding working_hours from google data to dhaaga db --OVER--

// const dayAndTimeExtractor = (dataArray: any) => {
//   const businessHours: any = {};

//   dataArray.map((item: any) => {
//     const day: string = item[0];
//     Object.assign(businessHours, { [day]: [] });

//     if (item[1] === "Closed" || item[1] === "Open 24 hours") {
//       businessHours[item[0]] = item[1];
//     } else {
//       const whloeDayTime = item[1].split(",");

//       if (whloeDayTime.length === 2) {
//         for (const span of whloeDayTime) {
//           const firstSpan = span.split("-");
//           const fistSpanOfDay = { open: firstSpan[0], close: firstSpan[1] };
//           businessHours[item[0]].push(fistSpanOfDay);
//         }
//       }
//       if (whloeDayTime.length === 1) {
//         const firstSpan = whloeDayTime[0].split("-");
//         const spanOfDay = { open: firstSpan[0], close: firstSpan[1] };
//         businessHours[item[0]].push(spanOfDay);
//       }
//     }
//   });

//   return businessHours;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client: any = await ClientPromise;
  const db = client.db("dhaaga-db");
  const entitiesColl = await db.collection("entity");
  const reviewsColl = await db.collection("reviews");

  const result = await entitiesColl.find({}).toArray();
  const reviews = await reviewsColl.find({}).toArray();

  // SEED GOOGLE DATA PHOTOS INTO DHAAGA DB --start
  // let updatePhotosPromiseArray: any = [];
  // let counter = 0;
  // const updatePhotos = async (
  //   itemName: string,
  //   phone: string,
  //   photos: string[] | []
  // ) => {
  //   try {
  //     const result = await entitiesColl.updateOne(
  //       { category: "jewelry", name: itemName, phone },
  //       { $set: { photos } }
  //     );
  //     counter += 1;
  //     return result.modifiedCount ? result : { name: itemName };
  //   } catch (err) {
  //     throw err;
  //   }
  // };
  // SEED GOOGLE DATA PHOTOS INTO DHAAGA DB --over

  let updatePostalCodePromiseArray: any = [];

  const updatePostalCode = async (
    itemName: string,
    phone: string,
    zipCode: string
  ) => {
    try {
      const result = await entitiesColl.updateOne(
        { category: "jewelry", name: itemName, phone },
        { $set: { zip_code: zipCode } }
      );
      return result.modifiedCount ? result : { name: itemName };
    } catch (err) {
      throw err;
    }
  };

  const updatedRawData = jewelryData.map((item: any, index: number) => {
    //   if (item.latitude && item.longitude) {
    //     item.location = {};
    //     item.location.type = "Point";
    //     item.location.coordinates = [+item.longitude, +item.latitude];
    //     delete item.latitude;
    //     delete item.longitude;
    //   }

    //   if (item.category !== "jewelry") {
    //     item.sub_category = item.category;
    //     item.category = "jewelry";
    //   }

    //   if (item.phone === "NA" || item.phone === "N/A") {
    //     item.phone = "";
    //   }

    //   if (item.site === "NA" || item.site === "N/A") {
    //     item.site = "";
    //   }

    //   if (
    //     item.full_address === "NA" ||
    //     item.full_address === "N/A" ||
    //     item.full_address.toLowerCase() === "online" ||
    //     item.full_address.toLowerCase() === "website"
    //   ) {
    //     item.full_address === "";
    //   }

    //   if (
    //     item.city === "NA" ||
    //     item.city === "N/A" ||
    //     item.city.toLowerCase() === "online" ||
    //     item.city.toLowerCase() === "website"
    //   ) {
    //     item.city === "";
    //   }

    // let zip_code = item.postal_code;
    // if (isNaN(zip_code)) {
    //   item.zip_code = "";
    // } else {
    //   item.zip_code = zip_code;
    // }
    // delete item.postal_code;

    //   if (
    //     item.state === "NA" ||
    //     item.state === "N/A" ||
    //     item.state.toLowerCase() === "online" ||
    //     item.state.toLowerCase() === "website"
    //   ) {
    //     item.state === "";
    //   }

    //   if (item.rating) {
    //     // if (item.rating) {
    //     //   item.rating = +item.rating;
    //     // }

    //     // if (item.reviews) {
    //     //   item.reviews = +item.reviews;
    //     // }

    //     delete item.rating;
    //   }

    //   if (item.reviews) {
    //     delete item.reviews;
    //   }

    //   // if (item.working_hours) {
    //   // const seperatedByComaSpace = splitFunction(
    //   //   item.working_hours,
    //   //   ", ",
    //   //   false
    //   // );
    //   // const seperatedByColonSpace = splitFunction(
    //   //   seperatedByComaSpace,
    //   //   ": ",
    //   //   true
    //   // );

    //   // const businessHours = dayAndTimeExtractor(seperatedByColonSpace);
    //   // item.business_hours = businessHours;
    //   //   delete item.working_hours;
    //   // }

    //   const Reviews: any = [];

    //   for (const key of Object.keys(item)) {
    //     if (
    //       key.startsWith("Review ") &&
    //       (item[key] === "" || item[key] === "NA" || item[key] === "N/A")
    //     ) {
    //       delete item[key];
    //     }
    //   }

    // const photos: string[] = [];

    // for (let key of Object.keys(item)) {
    //   if (key.startsWith("photo") && item[key].startsWith("https")) {
    //     photos.push(item[key]);
    //     // delete item[key];
    //   } //else if (key.startsWith("photo") && !item[key].startsWith("https")) {
    //   delete item[key];
    // }
    // }

    // const keysOfItem = Object.keys(item);

    // keysOfItem.map((key) => {
    //   // if (key.includes("Review")) {
    //   //   const review = {
    //   //     createdBy: "",
    //   //     rating: 0,
    //   //     reviewText: item[key],
    //   //   };
    //   //   Reviews.push(review);
    //   //   delete item[key];
    //   // }

    //   if (key.includes("photo")) {
    //     if (item[key] && item[key] !== "NA") {
    //       photos.push(item[key]);
    //       delete item[key];
    //     } else {
    //       delete item[key];
    //     }
    //   }
    // });

    // item.Reviews = Reviews;
    // item.photos = photos;

    if (isNaN(item.postal_code)) {
      item.postal_code = "";
    }

    updatePostalCodePromiseArray.push(
      updatePostalCode(item.name, item.phone, item.postal_code)
    );

    return item;
  });

  try {
    const values = await Promise.all(updatePostalCodePromiseArray);
    res.send(values);
  } catch (err) {
    res.send(err);
  }

  // SEED GOOGLE DATA PHOTOS INTO DHAAGA DB --start

  // SEED GOOGLE DATA PHOTOS INTO DHAAGA DB --over

  // await entitiesColl.updateMany({}, { $unset: { working_hours: 1 } });

  // const rslt = await entitiesColl.deleteMany({});
  // const rslt = await entitiesColl.insertMany(updatedRawData);

  // Seed google DATA
  // let appendReviewRatingPromiseArray: any = [];
  // let counter = 0;

  // jewelryData.map((item: any) => {
  //   const appendReviewRating = async (
  //     productName: string,
  //     reviews: string,
  //     rating: string
  //   ) => {
  //     try {
  //       const reviewsInNumber = +reviews;
  //       const ratingInNumber = +rating;
  //       const reslt = await entitiesColl.updateOne(
  //         { name: productName, category: "jewelry" },
  //         {
  //           $set: {
  //             rating: ratingInNumber,
  //             reviews: reviewsInNumber,
  //           },
  //         }
  //       );
  //       counter += 1;
  //       return reslt;
  //     } catch (err) {
  //       console.log(err);
  //       throw err;
  //     }
  //   };

  //   let googleReviews = "";
  //   let googleRating = "";

  //   if (
  //     item.reviews !== "N/A" &&
  //     item.reviews !== "NA" &&
  //     item.reviews !== ""
  //   ) {
  //     googleReviews = item.reviews;
  //   }
  //   if (item.rating !== "N/A" && item.rating !== "NA" && item.rating !== "") {
  //     googleRating = item.rating;
  //   }

  //   appendReviewRatingPromiseArray.push(
  //     appendReviewRating(item.name, googleReviews, googleRating)
  //   );
  // });

  // try {
  //   const values = await Promise.all(appendReviewRatingPromiseArray);
  //   console.log(counter);
  //   res.json(values);
  // } catch (err) {
  //   console.log(err);
  //   res.send(err);
  // }
  //seed google DATA

  // SEED GOOGLE DATA WORKING HOURS

  // loop for converting NARROW-NON-BREAKING-SPACE to SPACE

  // const convertedGoogleData = jewelryData.map((item: any, index: number) => {
  //   const working_hours = item.working_hours;
  //   let working_hr = "";
  //   for (let i = 0; i < working_hours.length; i++) {
  //     if (working_hours[i] === " ") {
  //       working_hr += " ";
  //     } else if (working_hours[i] === "–") {
  //       working_hr += "-";
  //     } else if (
  //       working_hours[i] === ":" &&
  //       working_hours[i - 1] === "y" &&
  //       working_hours[i + 1] !== " "
  //     ) {
  //       working_hr += ": ";
  //     } else if (
  //       working_hours[i] === " " &&
  //       working_hours[i - 1] === "," &&
  //       !isNaN(working_hours[i + 1])
  //     ) {
  //       working_hr += "";
  //     } else {
  //       working_hr += working_hours[i];
  //     }
  //   }
  //   item.working_hours = working_hr;
  //   return item;
  // });

  // let updateBusinessHoursPromiseArray: any = [];
  // let counter = 0;

  // const updateWorkingHours = async (
  //   itemName: string,
  //   working_hr: any,
  //   phone: string
  // ) => {
  //   try {
  //     const reslt = await entitiesColl.updateOne(
  //       {
  //         category: "jewelry",
  //         name: itemName,
  //         phone,
  //       },
  //       { $set: { business_hours: working_hr } }
  //     );
  //     counter += 1;
  //     return reslt;
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  // convertedGoogleData.forEach((item: any, index: number) => {
  //   let business_hours: any = {
  //     Sunday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //     Monday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //     Tuesday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //     Wednesday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //     Thursday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //     Friday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //     Saturday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //     ],
  //   };

  //   if (
  //     item.working_hours === "NA" ||
  //     item.working_hours === "N/A" ||
  //     item.working_hours === ""
  //   ) {
  //     business_hours = "";
  //   } else {
  //     const splitByCommaSpace = splitFunction(item.working_hours, ", ", false);
  //     const splitByColonSpace = splitFunction(splitByCommaSpace, ": ", true);

  //     splitByColonSpace.forEach((item: any) => {
  //       if (item[1] === "Closed") {
  //         business_hours[item[0]][2] = { closed: "Closed" };
  //       } else if (item[1] === "Open 24 hours") {
  //         business_hours[item[0]][2] = { open: "Open 24 hours" };
  //       } else {
  //         const splitTimeByComa = splitFunction(item[1], ",", false);
  //         if (splitTimeByComa.length === 2) {
  //           const firstSpanOfTheDay = splitFunction(
  //             splitTimeByComa[0],
  //             "-",
  //             false
  //           );

  //           const firstSpanObject =
  //             checkIfAmOrPmAvailableAndReturnTimeAccordingly(firstSpanOfTheDay);
  //           business_hours[item[0]][0] = firstSpanObject;

  //           const secondSpanOfTheDay = splitFunction(
  //             splitTimeByComa[1],
  //             "-",
  //             false
  //           );

  //           const secondSpanObject =
  //             checkIfAmOrPmAvailableAndReturnTimeAccordingly(
  //               secondSpanOfTheDay
  //             );
  //           business_hours[item[0]][1] = secondSpanObject;
  //         } else if (splitTimeByComa.length === 1) {
  //           const spanOfTheDay = splitFunction(splitTimeByComa[0], "-", false);

  //           const spanObject =
  //             checkIfAmOrPmAvailableAndReturnTimeAccordingly(spanOfTheDay);
  //           business_hours[item[0]][0] = spanObject;
  //         }
  //       }
  //     });
  //   }

  //   updateBusinessHoursPromiseArray.push(
  //     updateWorkingHours(item.name, business_hours, item.phone)
  //   );
  // });

  // try {
  //   const values = await Promise.all(updateBusinessHoursPromiseArray);
  //   console.log(counter);
  //   res.send(values);
  // } catch (err) {
  //   console.log(err);
  //   res.send("ok");
  // }

  // loop for converting NARROW-NON-BREAKING-SPACE to SPACE

  // SEED GOOGLE DATA WORKING HOURS

  // Update Review

  // const updateReviewPromise: any = [];

  // const updatedResult = result.map((item: any) => {
  //   const makeReview = async (reviewText: string) => {
  //     try {
  //       const rslt = await reviewsColl.insertOne({
  //         user_id: "",
  //         product_id: item._id,
  //         rating: 0,
  //         reviewText,
  //         created_date: Date.now(),
  //       });
  //       const updatedDoc = await entitiesColl.findOneAndUpdate(
  //         { _id: item._id },
  //         { $push: { Reviews: rslt.insertedId } }
  //       );
  //       return updatedDoc;
  //     } catch (error) {
  //       throw error;
  //     }
  //   };

  //   for (let key of Object.keys(item)) {
  //     if (
  //       key.startsWith("Review ") &&
  //       (item[key] !== "" || item[key] !== "NA")
  //     ) {
  //       updateReviewPromise.push(makeReview(item[key]));
  //     }
  //   }
  // });

  // try {
  //   const values = await Promise.all(updateReviewPromise);
  //   res.json(values);
  // } catch (err) {
  //   console.log(err);
  // }

  // Update Review

  // const client = await connectToDb();
  // const db = client?.db("test");

  // const transformedData = db?.collection("transformedData");

  // const result = await transformedData?.insertMany(jsonRawData);

  // xlsxj(
  //   {
  //     input: "Rhode Island Data v2.xlsx",
  //     output: "xlsxToJson/jewelry.json",
  //     sheet: "Jewelry RI",
  //   },
  //   function (err: any, result: any) {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       res.json(result);
  //     }
  //   }
  // );

  // Printing data
  // let allReviewText: any = [];
  // result.map((item: any) => {
  //   let reviewText: any = [];
  //   item.Reviews.map((review: any) =>
  //     reviewText.push({ reviewText: review.reviewText, productId: item._id })
  //   );
  //   return allReviewText.push(reviewText);
  // });

  // const seedData = async (item: any, user_id: string) => {
  //   const result = await reviewsColl.insertOne({
  //     user_id,
  //     product_id: item.productId,
  //     rating: Math.floor(Math.random() * 3 + 3),
  //     reviewText: item.reviewText,
  //     created_date: Date.now(),
  //   });
  // };

  // let insertDataPromise: any = [];
  // for (let reviewArray of allReviewText) {
  //   for (let i = 0; i < 3; i++) {
  //     const userId = [
  //       "YMunPcV6aDRYWgWYFZNxfeVKBZR2",
  //       "0XCb0p4aULN7pRs05s2tJSevyXN2",
  //       "M5ZVR9295yPzP6LlyrT0JxCWjlo2",
  //     ];
  //     insertDataPromise.push(seedData(reviewArray[i], userId[i]));
  //   }
  // }

  // try {
  //   const values = await Promise.all(insertDataPromise);
  //   console.log(values);
  // } catch (error) {
  //   console.log(error);
  // }

  // const seedData = async (productId: ObjectId) => {
  //   const reviews = await reviewsColl.find({ product_id: productId }).toArray();
  //   const reviewsIdArray: any = [];
  //   reviews.forEach((review: any) => {
  //     reviewsIdArray.push(review._id);
  //   });
  //   const product = await entitiesColl.findOneAndUpdate(
  //     { _id: productId },
  //     { $set: { Reviews: reviewsIdArray } }
  //   );
  //   return product;
  // };

  // let insertDataPromise: any = [];
  // result.forEach((item: any) => {
  //   insertDataPromise.push(seedData(item._id));
  // });

  // try {
  //   const value = await Promise.all(insertDataPromise);
  //   console.log(value);
  // } catch (error) {
  //   console.log(error);
  // }

  // REMOVE reviews AND ratings FROM entity document

  // const updateResult = await entitiesColl.updateMany(
  //   {},
  //   { $unset: { reviews: "", rating: "" } }
  // );
  // console.log(updateResult);

  // const updateData = async (reviewId: any, newReviewText: string) => {
  //   const reslt = await reviewsColl.updateOne(
  //     { _id: reviewId },
  //     { $set: { reviewText: newReviewText } }
  //   );
  //   return reslt;
  // };

  // const updateReviewPromise: any = [];
  // result.forEach((product: any) => {
  //   reviews.forEach((review: any) => {
  //     if (review.product_id.toString() === product._id.toString()) {
  //       const reviewTextLength = review.reviewText.length;
  //       if (reviewTextLength > 200) {
  //         const newReviewText = review.reviewText.substring(0, 200);
  //         updateReviewPromise.push(updateData(review._id, newReviewText));
  //       }
  //     }
  //   });
  // });

  // try {
  //   const value = await Promise.all(updateReviewPromise);
  //   console.log(value);
  // } catch (err) {
  //   console.log(err);
  // }

  // ADDING OWNER ID FOR EACH PRODUCT
  // const seedData = async (item: any) => {
  //   const ownerId = [
  //     "YMunPcV6aDRYWgWYFZNxfeVKBZR2",
  //     "elZi8ei4wiPIUoj7E2JBKAKfEIh1",
  //     "iI5sBRECpHed65yldLtBfpdimL53",
  //   ];
  //   const result = await entitiesColl.updateOne(
  //     { _id: item._id },
  //     { $set: { owner_id: ownerId[Math.floor(Math.random() * 3)] } }
  //   );
  //   return result;
  // };

  // let updateEntityPromise: any = [];

  // result.forEach((item: any) => {
  //   updateEntityPromise.push(seedData(item));
  // });

  // try {
  //   const value = await Promise.all(updateEntityPromise);
  //   console.log(value);
  // } catch (err) {
  //   console.log(err);
  // }

  // const businessHours = [
  //   {
  //     Sunday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //       { closed: "Closed" },
  //     ],
  //     Monday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "20:00" },
  //     ],
  //     Tuesday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Wednesday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Thursday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Friday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Saturday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "20:00" },
  //     ],
  //   },
  //   {
  //     Sunday: [
  //       { open: "10:00", close: "15:00" },
  //       { open: "17:00", close: "21:30" },
  //     ],
  //     Monday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //       { closed: "Closed" },
  //     ],
  //     Tuesday: [
  //       { open: "10:00", close: "15:00" },
  //       { open: "17:00", close: "21:30" },
  //     ],
  //     Wednesday: [
  //       { open: "10:00", close: "15:00" },
  //       { open: "17:00", close: "21:30" },
  //     ],
  //     Thursday: [
  //       { open: "10:00", close: "15:00" },
  //       { open: "17:00", close: "21:30" },
  //     ],
  //     Friday: [
  //       { open: "10:00", close: "15:00" },
  //       { open: "17:00", close: "21:30" },
  //     ],
  //     Saturday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "20:00" },
  //     ],
  //   },
  //   {
  //     Sunday: [
  //       { open: "11:00", close: "14:30" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Monday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //       { closed: "Closed" },
  //     ],
  //     Tuesday: [
  //       { open: "11:00", close: "14:30" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Wednesday: [
  //       { open: "11:00", close: "14:30" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Thursday: [
  //       { open: "11:00", close: "14:30" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Friday: [
  //       { open: "11:00", close: "14:30" },
  //       { open: "17:00", close: "21:00" },
  //     ],
  //     Saturday: [
  //       { open: "11:00", close: "15:00" },
  //       { open: "17:00", close: "20:00" },
  //     ],
  //   },
  //   {
  //     Sunday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //       { closed: "Closed" },
  //     ],
  //     Monday: [
  //       { open: "11:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //     Tuesday: [
  //       { open: "11:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //     Wednesday: [
  //       { open: "11:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //     Thursday: [
  //       { open: "11:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //     Friday: [
  //       { open: "11:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //     Saturday: [
  //       { open: "11:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //   },
  //   {
  //     Sunday: [
  //       { open: "", close: "" },
  //       { open: "", close: "" },
  //       { closed: "Closed" },
  //     ],
  //     Monday: [
  //       { open: "10:00", close: "22:00" },
  //       { open: "", close: "" },
  //     ],
  //     Tuesday: [
  //       { open: "10:00", close: "22:00" },
  //       { open: "", close: "" },
  //     ],
  //     Wednesday: [
  //       { open: "10:00", close: "22:00" },
  //       { open: "", close: "" },
  //     ],
  //     Thursday: [
  //       { open: "10:00", close: "22:00" },
  //       { open: "", close: "" },
  //     ],
  //     Friday: [
  //       { open: "10:00", close: "21:00" },
  //       { open: "", close: "" },
  //     ],
  //     Saturday: [
  //       { open: "10:00", close: "22:00" },
  //       { open: "", close: "" },
  //     ],
  //   },
  // ];

  // const updateBusinessHours = async (product: any) => {
  //   const rslt = await entitiesColl.updateOne(
  //     { _id: product._id },
  //     { $set: { business_hours: businessHours[Math.floor(Math.random() * 5)] } }
  //   );
  //   return rslt;
  // };

  // const updateBusinessHoursPromiseArray: any = [];
  // result.forEach((item: any) =>
  //   updateBusinessHoursPromiseArray.push(updateBusinessHours(item))
  // );

  // try {
  //   const values = await Promise.all(updateBusinessHoursPromiseArray);
  //   console.log(values);
  // } catch (error) {
  //   console.log(error);
  // }

  // console.log(process.env.AWS_REGION);

  // res.json("ok");
}
