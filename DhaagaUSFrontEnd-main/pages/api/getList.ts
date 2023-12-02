// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../server/mongodb";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { category, search, locations, sort, radiusInMiles } = req.query;

  let radius = 5;
  if (radiusInMiles) {
    radius = parseInt(radiusInMiles!.toString());
  }

  let longitude;
  let latitude;

  if (locations) {
    const searchParams = new URLSearchParams(req.query.locations?.toString());
    longitude = +searchParams.get("longitude")!;
    latitude = +searchParams.get("latitude")!;
  }

  const searchPattern = `${typeof search === "string" ? search.trim() : ""}`;
  const reg = new RegExp(searchPattern.toString());

  try {
    const client: any = await ClientPromise;
    const db = client.db("dhaaga-db");
    const dataColl = db.collection("entity");
  } catch (error) {}

  const client: any = await ClientPromise;
  const db = client.db("dhaaga-db");
  const dataColl = db.collection("entity");

  const aggFor_No_Category_No_Search_No_Sort = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; // !category !search !sort or sort distance

  const aggFor_Category_No_Search_No_Sort = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
        category: category,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; // category !search !sort or sort distance

  const aggFor_No_Category_Search_No_Sort = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
        category: {
          $regex: reg,
          $options: "i",
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; // !category search !sort or sort distance

  const aggFor_No_Category_No_Search_Sort_Rating = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        avgRating: -1,
        reviewCount: -1,
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; // !category !search sort rating

  const aggFor_No_Category_No_Search_Sort_MostReviewd = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; // !category !search sort mostReviewd

  // const aggFor_Category_Search_No_Sort = [
  //   {
  //     $match: {
  //       location: {
  //         $geoWithin: {
  //           $centerSphere: [[longitude, latitude], radius / 3963.2],
  //         },
  //       },
  //       category: category,
  //       name: {
  //         $regex: reg,
  //         $options: "i",
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "reviews",
  //       localField: "Reviews",
  //       foreignField: "_id",
  //       as: "Reviews",
  //     },
  //   },
  //   {
  //   $addFields: {
  //     reviewCount: {
  //       $switch: {
  //         branches: [
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: ["$rating"],
  //                 },
  //                 {
  //                   $not: ["$reviews"],
  //                 },
  //                 {
  //                   $eq: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: "$$REMOVE",
  //           },
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: ["$rating"],
  //                 },
  //                 {
  //                   $not: ["$reviews"],
  //                 },
  //                 {
  //                   $gt: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: { $size: "$Reviews" },
  //           },
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: [{ $eq: ["$rating", null] }],
  //                 },
  //                 {
  //                   $not: [{ $eq: ["$reviews", null] }],
  //                 },
  //                 {
  //                   $eq: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: "$reviews",
  //           },
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: [{ $eq: ["$rating", null] }],
  //                 },
  //                 {
  //                   $not: [{ $eq: ["$reviews", null] }],
  //                 },
  //                 {
  //                   $gt: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: {
  //               $add: ["$reviews", { $size: "$Reviews" }],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     avgRating: {
  //       $switch: {
  //         branches: [
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: ["$rating"],
  //                 },
  //                 {
  //                   $not: ["$reviews"],
  //                 },
  //                 {
  //                   $eq: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: "$$REMOVE",
  //           },
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: ["$rating"],
  //                 },
  //                 {
  //                   $not: ["$reviews"],
  //                 },
  //                 {
  //                   $gt: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: {
  //               $round: [
  //                 {
  //                   $avg: "$Reviews.rating",
  //                 },
  //                 1,
  //               ],
  //             },
  //           },
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: [{ $eq: ["$rating", null] }],
  //                 },
  //                 {
  //                   $not: [{ $eq: ["$reviews", null] }],
  //                 },
  //                 {
  //                   $eq: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: "$rating",
  //           },
  //           {
  //             case: {
  //               $and: [
  //                 {
  //                   $not: [{ $eq: ["$rating", null] }],
  //                 },
  //                 {
  //                   $not: [{ $eq: ["$reviews", null] }],
  //                 },
  //                 {
  //                   $gt: [{ $size: "$Reviews" }, 0],
  //                 },
  //               ],
  //             },
  //             then: {
  //               $round: [
  //                 {
  //                   $divide: [
  //                     {
  //                       $add: [
  //                         {
  //                           $avg: "$Reviews.rating",
  //                         },
  //                         "$rating",
  //                       ],
  //                     },
  //                     2,
  //                   ],
  //                 },
  //                 1,
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   },
  // },
  // {
  //   $project: {
  //     rating: 0
  //   }
  // },
  //   {
  //     $group: {
  //       _id: "category",
  //       products: {
  //         $push: "$$ROOT",
  //       },
  //     },
  //   },
  // ];

  const aggFor_Category_No_Search_Sort_Rating = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
        category: category,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        avgRating: -1,
        reviewCount: -1,
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; //category !search sort rating

  const aggFor_Category_No_Search_Sort_MostReviewd = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
        category: category,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; //category !search sort mostReviewed

  const aggFor_No_Category_Search_Sort_Rating = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
        category: {
          $regex: reg,
          $options: "i",
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        avgRating: -1,
        reviewCount: -1,
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; //!category search sort rating

  const aggFor_No_Category_Search_Sort_MostReviewd = [
    {
      $match: {
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
        category: {
          $regex: reg,
          $options: "i",
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "Reviews",
        foreignField: "_id",
        as: "Reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: { $size: "$Reviews" },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$reviews",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $add: ["$reviews", { $size: "$Reviews" }],
                },
              },
            ],
          },
        },
        avgRating: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$$REMOVE",
              },
              {
                case: {
                  $and: [
                    {
                      $not: ["$rating"],
                    },
                    {
                      $not: ["$reviews"],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $avg: "$Reviews.rating",
                    },
                    1,
                  ],
                },
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $eq: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: "$rating",
              },
              {
                case: {
                  $and: [
                    {
                      $not: [{ $eq: ["$rating", null] }],
                    },
                    {
                      $not: [{ $eq: ["$reviews", null] }],
                    },
                    {
                      $gt: [{ $size: "$Reviews" }, 0],
                    },
                  ],
                },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $add: [
                            {
                              $avg: "$Reviews.rating",
                            },
                            "$rating",
                          ],
                        },
                        2,
                      ],
                    },
                    1,
                  ],
                },
              },
            ],
          },
        },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $project: {
        rating: 0,
      },
    },
    // {
    //   $limit: 15,
    // },
    {
      $group: {
        _id: "category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
  ]; //!category search sort mostReviewed

  // const aggFor_Category_Search_Sort_Rating = [
  //   {
  //     $match: {
  //       location: {
  //         $geoWithin: {
  //           $centerSphere: [[longitude, latitude], radius / 3963.2],
  //         },
  //       },
  //       category: category,
  //       name: {
  //         $regex: reg,
  //         $options: "i",
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "reviews",
  //       localField: "Reviews",
  //       foreignField: "_id",
  //       as: "Reviews",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       reviewCount: {
  //         $switch: {
  //           branches: [
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$$REMOVE",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: { $size: "$Reviews" },
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$reviews",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: {
  //                 $add: ["$reviews", { $size: "$Reviews" }],
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       avgRating: {
  //         $switch: {
  //           branches: [
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$$REMOVE",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: {
  //                 $round: [
  //                   {
  //                     $avg: "$Reviews.rating",
  //                   },
  //                   1,
  //                 ],
  //               },
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$rating",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: {
  //                 $round: [
  //                   {
  //                     $divide: [
  //                       {
  //                         $add: [
  //                           {
  //                             $avg: "$Reviews.rating",
  //                           },
  //                           "$rating",
  //                         ],
  //                       },
  //                       2,
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   },
  //     {
  //       $sort: {
  //         avgRating: -1,
  //         reviewCount: -1,
  //       },
  //     },
  //   {
  //     $project: {
  //       rating: 0
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: "category",
  //       products: {
  //         $push: "$$ROOT",
  //       },
  //     },
  //   },
  // ]; //category search sort rating

  // const aggFor_Category_Search_Sort_MostReviewd = [
  //   {
  //     $match: {
  //       location: {
  //         $geoWithin: {
  //           $centerSphere: [[longitude, latitude], radius / 3963.2],
  //         },
  //       },
  //       category: category,
  //       name: {
  //         $regex: reg,
  //         $options: "i",
  //       },
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "reviews",
  //       localField: "Reviews",
  //       foreignField: "_id",
  //       as: "Reviews",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       reviewCount: {
  //         $switch: {
  //           branches: [
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$$REMOVE",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: { $size: "$Reviews" },
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$reviews",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: {
  //                 $add: ["$reviews", { $size: "$Reviews" }],
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       avgRating: {
  //         $switch: {
  //           branches: [
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$$REMOVE",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: ["$rating"],
  //                   },
  //                   {
  //                     $not: ["$reviews"],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: {
  //                 $round: [
  //                   {
  //                     $avg: "$Reviews.rating",
  //                   },
  //                   1,
  //                 ],
  //               },
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $eq: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: "$rating",
  //             },
  //             {
  //               case: {
  //                 $and: [
  //                   {
  //                     $not: [{ $eq: ["$rating", null] }],
  //                   },
  //                   {
  //                     $not: [{ $eq: ["$reviews", null] }],
  //                   },
  //                   {
  //                     $gt: [{ $size: "$Reviews" }, 0],
  //                   },
  //                 ],
  //               },
  //               then: {
  //                 $round: [
  //                   {
  //                     $divide: [
  //                       {
  //                         $add: [
  //                           {
  //                             $avg: "$Reviews.rating",
  //                           },
  //                           "$rating",
  //                         ],
  //                       },
  //                       2,
  //                     ],
  //                   },
  //                   1,
  //                 ],
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   },
  //     {
  //       $sort: {
  //         reviewCount: -1,
  //       },
  //     },
  //   {
  //     $project: {
  //       rating: 0
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: "category",
  //       products: {
  //         $push: "$$ROOT",
  //       },
  //     },
  //   },
  // ]; //category search sort mostReviewed

  const emptyResult: any = [];

  if (locations) {
    if (!category && !search && !sort) {
      // const test = await dataColl
      //   .find({ category: "restaurants" })
      //   // .limit(10)
      //   .toArray();
      // res.status(200).json(test);
      try {
        const cursor = await dataColl.aggregate(
          aggFor_No_Category_No_Search_No_Sort
        );
        const result = await cursor.toArray();
        if (!result.length) {
          return res.status(404).json(result);
        }
        const products = result[0].products;
        res.status(200).json(products);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error finding result!" });
      }
    }

    if (category && !search && !sort) {
      // const test = await dataColl
      //   .find({ category: category })
      //   // .limit(10)
      //   .toArray();
      // res.status(200).json(test);
      try {
        const cursor = await dataColl.aggregate(
          aggFor_Category_No_Search_No_Sort
        );
        const result = await cursor.toArray();
        if (!result.length) {
          return res.status(404).json(result);
        }
        const products = result[0].products;
        res.status(200).json(products);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error finding result!" });
      }
    }

    if (!category && search && !sort) {
      // const test = await dataColl
      //   .find({
      //     category: "restaurants",
      //     name: { $regex: reg, $options: "i" },
      //   })
      // .limit(10)
      // .toArray();
      // res.status(200).json(test);
      try {
        const cursor = await dataColl.aggregate(
          aggFor_No_Category_Search_No_Sort
        );
        const result = await cursor.toArray();
        if (!result.length) {
          return res.status(404).json(result);
        }
        const products = result[0].products;
        res.status(200).json(products);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error finding result!" });
      }
    }

    if (!category && !search && sort) {
      if (sort === "ratings") {
        // const test = await dataColl
        //   .find({ category: "restaurants" })
        //   .sort({ rating: -1, _id: -1 })
        //   // .limit(10)
        //   .toArray();
        // res.status(200).json(test);
        try {
          const cursor = await dataColl.aggregate(
            aggFor_No_Category_No_Search_Sort_Rating
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Error finding result!" });
        }
      } else if (sort === "mostReviewed") {
        // const test = await dataColl
        //   .find({ category: "restaurants" })
        //   .sort({ reviews: -1 })
        //   // .limit(10)
        //   .toArray();
        // res.status(200).json(test);
        try {
          const cursor = await dataColl.aggregate(
            aggFor_No_Category_No_Search_Sort_MostReviewd
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else if (sort === "distance") {
        try {
          const cursor = await dataColl.aggregate(
            aggFor_No_Category_No_Search_No_Sort
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else {
        const test: any = [];
        res.status(400).json(test);
      }
    }

    // if (category && search && !sort) {
    //   // const test = await dataColl
    //   //   .find({
    //   //     category: category,
    //   //     name: { $regex: reg, $options: "i" },
    //   //   })
    //   //   // .limit(10)
    //   //   .toArray();
    //   // res.status(200).json(test);
    //   const cursor = await dataColl.aggregate(aggFor_Category_Search_No_Sort);
    //   const result = await cursor.toArray();
    //   if (!result.length) {
    //     return res.status(500).json(result);
    //   }
    //   const products = result[0].products;
    //   res.status(200).json(products);
    // }

    if (category && !search && sort) {
      if (sort === "ratings") {
        // const test = await dataColl
        //   .find({ category: category })
        //   .sort({ rating: -1, _id: -1 })
        //   // .limit(10)
        //   .toArray();
        // res.status(200).json(test);
        try {
          const cursor = await dataColl.aggregate(
            aggFor_Category_No_Search_Sort_Rating
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else if (sort === "mostReviewed") {
        // const test = await dataColl
        //   .find({ category: category })
        //   .sort({ reviews: -1 })
        //   // .limit(10)
        //   .toArray();
        // res.status(200).json(test);
        try {
          const cursor = await dataColl.aggregate(
            aggFor_Category_No_Search_Sort_MostReviewd
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else if (sort === "distance") {
        try {
          const cursor = await dataColl.aggregate(
            aggFor_Category_No_Search_No_Sort
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else {
        const test: any = [];
        res.status(400).json(test);
      }
    }

    if (!category && search && sort) {
      if (sort === "ratings") {
        // const test = await dataColl
        //   .find({
        //     category: "restaurants",
        //     name: { $regex: reg, $options: "i" },
        //   })
        //   .sort({ rating: -1, _id: -1 })
        //   // .limit(10)
        //   .toArray();
        // res.status(200).json(test);
        try {
          const cursor = await dataColl.aggregate(
            aggFor_No_Category_Search_Sort_Rating
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else if (sort === "mostReviewed") {
        // const test = await dataColl
        //   .find({
        //     category: "restaurants",
        //     name: { $regex: reg, $options: "i" },
        //   })
        //   .sort({ reviews: -1 })
        //   // .limit(10)
        //   .toArray();
        // res.status(200).json(test);
        try {
          const cursor = await dataColl.aggregate(
            aggFor_No_Category_Search_Sort_MostReviewd
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else if (sort === "distance") {
        try {
          const cursor = await dataColl.aggregate(
            aggFor_No_Category_Search_No_Sort
          );
          const result = await cursor.toArray();
          if (!result.length) {
            return res.status(404).json(result);
          }
          const products = result[0].products;
          res.status(200).json(products);
        } catch (err) {
          console.log(err);
          res.status(500).json(emptyResult);
        }
      } else {
        const test: any = [];
        res.status(400).json(test);
      }
    }

    // if (category && search && sort) {
    //   if (sort === "ratings") {
    //     // const test = await dataColl
    //     //   .find({ category: category, name: { $regex: reg, $options: "i" } })
    //     //   .sort({ rating: -1, _id: -1 })
    //     //   // .limit(10)
    //     //   .toArray();
    //     // res.status(200).json(test);
    //     const cursor = await dataColl.aggregate(
    //       aggFor_Category_Search_Sort_Rating
    //     );
    //     const result = await cursor.toArray();
    //     if (!result.length) {
    //       return res.status(500).json(result);
    //     }
    //     const products = result[0].products;
    //     res.status(200).json(products);
    //   } else if (sort === "mostReviewed") {
    //     // const test = await dataColl
    //     //   .find({ category: category, name: { $regex: reg, $options: "i" } })
    //     //   .sort({ reviews: -1 })
    //     //   // .limit(10)
    //     //   .toArray();
    //     // res.status(200).json(test);
    //     const cursor = await dataColl.aggregate(
    //       aggFor_Category_Search_Sort_MostReviewd
    //     );
    //     const result = await cursor.toArray();
    //     if (!result.length) {
    //       return res.status(500).json(result);
    //     }
    //     const products = result[0].products;
    //     res.status(200).json(products);
    //   } else {
    //     const test: any = [];
    //     res.status(400).json(test);
    //   }
    // }
  } else {
    res.status(404).json(emptyResult);
  }
}
