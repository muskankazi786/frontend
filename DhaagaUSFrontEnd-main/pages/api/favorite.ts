import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";
import { ObjectId } from "mongodb";
import clientPromise from "@/server/mongodb";

type Data =
  | {
      isFavorite?: boolean;
      favProducts?: { name: string }[];
      error?: string;
    }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const productId = req.query.productId;
  const favorite = req.query.favorite;

  const productObjId = new ObjectId(productId?.toString());

  try {
    let user;
    const authHeader = req.headers.authorization;
    const cookies = nookies.get({ req });

    const token = authHeader?.substring(7, authHeader?.length) || cookies.token;
    user = await firebaseAdmin.auth().verifyIdToken(token);

    if (req.method === "POST") {
      try {
        const client: any = await clientPromise;
        const db = client.db("dhaaga-db");

        const userId = user?.uid;

        if (favorite && favorite === "true") {
          const product = await db
            .collection("entity")
            .findOne({ _id: productObjId });

          if (!product) {
            return res.status(404).json({ message: "Product not found!" });
          }

          const favProduct = await db
            .collection("favorites")
            .updateOne(
              { user_id: userId },
              { $push: { favoriteList: productObjId } },
              { upsert: true }
            );

          // if (!favProduct) {
          //   const res = await db
          //     .collection("favorites")
          //     .insertOne({ user_id: userId, favoriteList: [productObjId] });
          // } else {
          //   const res = await db
          //     .collection("favorites")
          //     .updateOne(
          //       { user_id: userId },
          //       { $addToSet: { favoriteList: productObjId } }
          //     );
          // }
        } else if (favorite && favorite === "false") {
          const favProduct = await db
            .collection("favorites")
            .findOne({ user_id: userId });
          if (favProduct.favoriteList.length === 1) {
            await db.collection("favorites").deleteOne({ user_id: userId });
          } else {
            await db
              .collection("favorites")
              .updateOne(
                { user_id: userId },
                { $pull: { favoriteList: { $in: [productObjId] } } }
              );
          }
        } else {
          return res
            .status(500)
            .json({ message: "Could not update product favorite state!" });
        }

        const favProduct = await db
          .collection("favorites")
          .findOne({ user_id: userId, favoriteList: productObjId });
        const isFavorite = !!favProduct;

        res.status(200).json({ isFavorite });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Could not update product favorite state!" });
      }
    }

    if (req.method === "GET") {
      try {
        const client: any = await clientPromise;
        const db = client.db("dhaaga-db");

        const userId = user?.uid;

        const isFavProduct = await db
          .collection("favorites")
          .findOne({ user_id: userId });
        if (
          !isFavProduct ||
          (isFavProduct && isFavProduct.favoriteList.length === 0)
        ) {
          res
            .status(404)
            .json({ message: "You don't have any favorite Product" });
        } else if (isFavProduct && isFavProduct.favoriteList.length > 0) {
          const favProductsPipeline = [
            {
              $match: {
                _id: {
                  $in: isFavProduct.favoriteList,
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
          ];
          const cursor = await db
            .collection("entity")
            .aggregate(favProductsPipeline);
          const favProducts = await cursor.toArray();
          // const favProducts = await db
          //   .collection("entity")
          //   .find({ _id: { $in: isFavProduct.favoriteList } })
          //   .toArray();
          res.status(200).json({ favProducts: favProducts });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not get favorite products!" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }

  // const authHeader = req.headers.authorization;

  // if (authHeader && authHeader.startsWith("Bearer ")) {
  //   const token = authHeader.substring(7, authHeader.length);
  //   user = await firebaseAdmin.auth().verifyIdToken(token);
  // }
  // const userId = user?.uid;

  // const client: any = await clientPromise;
  // const db = client.db("dhaaga-db");

  // if (req.method === "POST") {
  //   if (user && favorite && favorite === "true") {
  //     const favProduct = await db
  //       .collection("favorites")
  //       .findOne({ user_id: userId });

  //     if (!favProduct) {
  //       const res = await db
  //         .collection("favorites")
  //         .insertOne({ user_id: userId, favoriteList: [productObjId] });
  //     } else {
  //       const res = await db
  //         .collection("favorites")
  //         .updateOne(
  //           { user_id: userId },
  //           { $addToSet: { favoriteList: productObjId } }
  //         );
  //     }
  //   } else if (user && favorite && favorite === "false") {
  //     await db
  //       .collection("favorites")
  //       .updateOne(
  //         { user_id: userId },
  //         { $pull: { favoriteList: { $in: [productObjId] } } }
  //       );
  //   }

  //   const favProduct = await db
  //     .collection("favorites")
  //     .findOne({ user_id: userId, favoriteList: productObjId });
  //   const isFavorite = !!favProduct;

  //   res.status(200).json({ isFavorite });
  // }

  // if (req.method === "GET") {
  //   const isFavProduct = await db
  //     .collection("favorites")
  //     .findOne({ user_id: userId });
  //   if (
  //     !isFavProduct ||
  //     (isFavProduct && isFavProduct.favoriteList.length === 0)
  //   ) {
  //     res.json({ error: "You don't have any favorite Product" });
  //   } else if (isFavProduct && isFavProduct.favoriteList.length > 0) {
  //     const favProductsPipeline = [
  //       {
  //         $match: {
  //           _id: {
  //             $in: isFavProduct.favoriteList,
  //           },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "reviews",
  //           localField: "Reviews",
  //           foreignField: "_id",
  //           as: "Reviews",
  //         },
  //       },
  //       {
  //         $addFields: {
  //           reviewCount: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: ["$rating"],
  //                       },
  //                       {
  //                         $not: ["$reviews"],
  //                       },
  //                       {
  //                         $eq: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: "$$REMOVE",
  //                 },
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: ["$rating"],
  //                       },
  //                       {
  //                         $not: ["$reviews"],
  //                       },
  //                       {
  //                         $gt: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: { $size: "$Reviews" },
  //                 },
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: [{ $eq: ["$rating", null] }],
  //                       },
  //                       {
  //                         $not: [{ $eq: ["$reviews", null] }],
  //                       },
  //                       {
  //                         $eq: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: "$reviews",
  //                 },
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: [{ $eq: ["$rating", null] }],
  //                       },
  //                       {
  //                         $not: [{ $eq: ["$reviews", null] }],
  //                       },
  //                       {
  //                         $gt: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: {
  //                     $add: ["$reviews", { $size: "$Reviews" }],
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           avgRating: {
  //             $switch: {
  //               branches: [
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: ["$rating"],
  //                       },
  //                       {
  //                         $not: ["$reviews"],
  //                       },
  //                       {
  //                         $eq: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: "$$REMOVE",
  //                 },
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: ["$rating"],
  //                       },
  //                       {
  //                         $not: ["$reviews"],
  //                       },
  //                       {
  //                         $gt: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: {
  //                     $round: [
  //                       {
  //                         $avg: "$Reviews.rating",
  //                       },
  //                       1,
  //                     ],
  //                   },
  //                 },
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: [{ $eq: ["$rating", null] }],
  //                       },
  //                       {
  //                         $not: [{ $eq: ["$reviews", null] }],
  //                       },
  //                       {
  //                         $eq: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: "$rating",
  //                 },
  //                 {
  //                   case: {
  //                     $and: [
  //                       {
  //                         $not: [{ $eq: ["$rating", null] }],
  //                       },
  //                       {
  //                         $not: [{ $eq: ["$reviews", null] }],
  //                       },
  //                       {
  //                         $gt: [{ $size: "$Reviews" }, 0],
  //                       },
  //                     ],
  //                   },
  //                   then: {
  //                     $round: [
  //                       {
  //                         $divide: [
  //                           {
  //                             $add: [
  //                               {
  //                                 $avg: "$Reviews.rating",
  //                               },
  //                               "$rating",
  //                             ],
  //                           },
  //                           2,
  //                         ],
  //                       },
  //                       1,
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           rating: 0,
  //         },
  //       },
  //     ];
  //     const cursor = await db
  //       .collection("entity")
  //       .aggregate(favProductsPipeline);
  //     const favProducts = await cursor.toArray();
  //     // const favProducts = await db
  //     //   .collection("entity")
  //     //   .find({ _id: { $in: isFavProduct.favoriteList } })
  //     //   .toArray();
  //     res.status(200).json({ favProducts: favProducts });
  //   }
  // }
}
