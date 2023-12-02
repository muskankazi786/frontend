import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../../server/mongodb";
import nookies from "nookies";
import { firebaseAdmin } from "@/firebaseAdmin";
import { ReviewObject, UserProfileObject } from "@/Models/ListData";

type Data =
  | {
      product: {};
      isFavorite: boolean;
      hasReviewedProduct: boolean;
    }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const cookies = nookies.get({ req });
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7, authHeader.length) || cookies.token;

    const user = await firebaseAdmin.auth().verifyIdToken(token);
    try {
      const client: any = await ClientPromise;
      const db = client.db("dhaaga-db");

      const userId = user?.uid;

      const productId = req.query.productId;
      const productObjId = new ObjectId(productId?.toString());

      const agg = [
        {
          $facet: {
            whenReviewsArrayIsEmpty: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", productObjId],
                      },
                      {
                        $eq: [
                          {
                            $size: "$Reviews",
                          },
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $addFields: {
                  reviewCount: {
                    $cond: [
                      {
                        $and: [
                          {
                            $not: ["$rating"],
                          },
                          {
                            $not: ["$reviews"],
                          },
                        ],
                      },
                      "$$REMOVE",
                      "$reviews",
                    ],
                  },
                  avgRating: {
                    $cond: [
                      {
                        $and: [
                          {
                            $not: ["$rating"],
                          },
                          {
                            $not: ["$reviews"],
                          },
                        ],
                      },
                      "$$REMOVE",
                      "$rating",
                    ],
                  },
                },
              },
            ],
            whenReviewsArrayIsNotEmpty: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$_id", productObjId],
                      },
                      {
                        $gt: [
                          {
                            $size: "$Reviews",
                          },
                          0,
                        ],
                      },
                    ],
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
                $unwind: {
                  path: "$Reviews",
                },
              },
              {
                $sort: {
                  "Reviews.created_date": -1,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "Reviews.user_id",
                  foreignField: "_id",
                  as: "userInfo",
                },
              },
              {
                $unwind: {
                  path: "$userInfo",
                },
              },
              {
                $addFields: {
                  "Reviews.user_id": "$userInfo",
                },
              },
              {
                $group: {
                  _id: "$_id",
                  doc: {
                    $first: "$$ROOT",
                  },
                  Reviews: {
                    $push: "$Reviews",
                  },
                },
              },
              {
                $addFields: {
                  ownedReview: {
                    $filter: {
                      input: "$Reviews",
                      as: "review",
                      cond: {
                        $eq: ["$$review.user_id._id", userId],
                      },
                    },
                  },
                },
              },
              {
                $addFields: {
                  notOwnedReviews: {
                    $filter: {
                      input: "$Reviews",
                      as: "review",
                      cond: {
                        $ne: ["$$review.user_id._id", userId],
                      },
                      limit: {
                        $cond: [
                          {
                            $eq: [
                              {
                                $size: "$ownedReview",
                              },
                              0,
                            ],
                          },
                          3,
                          2,
                        ],
                      },
                    },
                  },
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      "$doc",
                      {
                        Reviews: "$Reviews",
                      },
                      {
                        ownedReview: "$ownedReview",
                      },
                      {
                        notOwnedReviews: "$notOwnedReviews",
                      },
                    ],
                  },
                },
              },
              {
                $addFields: {
                  dhaagaReviewCount: {
                    $size: "$Reviews",
                  },
                  reviewCount: {
                    $cond: [
                      {
                        $and: [
                          {
                            $not: ["$rating"],
                          },
                          {
                            $not: ["$reviews"],
                          },
                        ],
                      },
                      {
                        $size: "$Reviews",
                      },
                      {
                        $add: [
                          {
                            $size: "$Reviews",
                          },
                          "$reviews",
                        ],
                      },
                    ],
                  },
                  avgRating: {
                    $cond: [
                      {
                        $and: [
                          {
                            $not: ["$rating"],
                          },
                          {
                            $not: ["$reviews"],
                          },
                        ],
                      },
                      {
                        $round: [
                          {
                            $avg: "$Reviews.rating",
                          },
                          1,
                        ],
                      },
                      {
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
                    ],
                  },
                  Reviews: {
                    $concatArrays: ["$ownedReview", "$notOwnedReviews"],
                  },
                },
              },
              {
                $project: {
                  userInfo: 0,
                  ownedReview: 0,
                  notOwnedReviews: 0,
                  rating: 0,
                },
              },
            ],
          },
        },
      ];

      // Find whether the product is favorite or not
      const favProduct = await db
        .collection("favorites")
        .findOne({ user_id: userId, favoriteList: productObjId });
      const isFavorite = !!favProduct;

      // GET ALL REVIEWS RELATED TO THE PRODUCT
      const cursor = await db.collection("entity").aggregate(agg);
      const result = await cursor.toArray();

      const whenReviewsArrayIsEmpty = result[0].whenReviewsArrayIsEmpty; //When product has no dhaaga review
      const whenReviewsArrayIsNotEmpty = result[0].whenReviewsArrayIsNotEmpty; //When product has dhaaga reviews

      let product;
      if (whenReviewsArrayIsEmpty.length > 0) {
        product = whenReviewsArrayIsEmpty[0];
      } else if (whenReviewsArrayIsNotEmpty.length > 0) {
        product = whenReviewsArrayIsNotEmpty[0];
      } else {
        throw new Error("Aggregation Failed");
      }
      // CHECK WHETHER USER HAS REVIEWED PRODUCT OR NOT

      const hasReviewedProduct = !!product.Reviews.find(
        (el: ReviewObject) => userId === (el.user_id as UserProfileObject)._id
      );

      res.status(200).json({
        product,
        isFavorite: isFavorite,
        hasReviewedProduct,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Product not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
}
