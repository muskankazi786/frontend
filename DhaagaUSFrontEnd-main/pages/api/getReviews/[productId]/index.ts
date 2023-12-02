import type { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from "../../../../server/mongodb";
import { firebaseAdmin } from "@/firebaseAdmin";
import nookies from "nookies";
import { ObjectId } from "mongodb";
import { ReviewObject, UserProfileObject } from "@/Models/ListData";

type Data =
  | {
      reviewsData: {};
      hasReviewedProduct: boolean;
      reviews: number;
    }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productId, getAll } = req.query;
  const productObjId = new ObjectId(productId?.toString());

  try {
    const cookies = nookies.get({ req });
    const token = cookies.token;
    const user = await firebaseAdmin.auth().verifyIdToken(token);
    try {
      const client: any = await ClientPromise;
      const db = client.db("dhaaga-db");
      const reviewsColl = await db.collection("reviews");

      const userId = user?.uid;

      const aggForTheRequestAfterCreateReview = [
        {
          $match: {
            product_id: productObjId,
          },
        },
        {
          $sort: {
            created_date: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
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
            user_id: "$userInfo",
          },
        },
        {
          $unset: "userInfo",
        },
        {
          $group: {
            _id: "$product_id",
            reviews: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $addFields: {
            ownedReview: {
              $filter: {
                input: "$reviews",
                as: "review",
                cond: {
                  $eq: ["$$review.user_id._id", userId],
                },
              },
            },
            notOwnedReviews: {
              $filter: {
                input: "$reviews",
                as: "review",
                cond: {
                  $ne: ["$$review.user_id._id", userId],
                },
                limit: 2,
              },
            },
            reviewCount: {
              $size: "$reviews",
            },
          },
        },
        {
          $addFields: {
            reviews: {
              $concatArrays: ["$ownedReview", "$notOwnedReviews"],
            },
          },
        },
        {
          $project: {
            ownedReview: 0,
            notOwnedReviews: 0,
          },
        },
      ];

      const aggForTheSeeMoreReviewsRequest = [
        {
          $match: {
            product_id: productObjId,
          },
        },
        {
          $sort: {
            created_date: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
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
            user_id: "$userInfo",
          },
        },
        {
          $unset: "userInfo",
        },
        {
          $group: {
            _id: "$product_id",
            reviews: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $addFields: {
            ownedReview: {
              $filter: {
                input: "$reviews",
                as: "review",
                cond: {
                  $eq: ["$$review.user_id._id", userId],
                },
              },
            },
            notOwnedReviews: {
              $filter: {
                input: "$reviews",
                as: "review",
                cond: {
                  $ne: ["$$review.user_id._id", userId],
                },
              },
            },
            reviewCount: {
              $size: "$reviews",
            },
          },
        },
        {
          $addFields: {
            reviews: {
              $concatArrays: ["$ownedReview", "$notOwnedReviews"],
            },
          },
        },
        {
          $project: {
            ownedReview: 0,
            notOwnedReviews: 0,
          },
        },
      ];

      if (!getAll) {
        // GET THREE REVIEWS RELATED TO THE PRODUCT
        const cursor = await reviewsColl.aggregate(
          aggForTheRequestAfterCreateReview
        );
        const result = await cursor.toArray();
        const reviews = result[0].reviews;
        const reviewCount = result[0].reviewCount;

        // CHECK WHETHER THE USER HAS REVIEWED PRODUCT OR NOT
        const hasReviewedProduct = !!reviews.find(
          (el: ReviewObject) => userId === (el.user_id as UserProfileObject)._id
        );

        res.status(200).json({
          reviewsData: reviews,
          hasReviewedProduct,
          reviews: reviewCount,
        });
      }
      if (getAll) {
        // GET ALL REVIEWS RELATED TO THE PRODUCT
        const cursor = await reviewsColl.aggregate(
          aggForTheSeeMoreReviewsRequest
        );
        const result = await cursor.toArray();
        const reviews = result[0].reviews;
        const reviewCount = result[0].reviewCount;

        // CHECK WHETHER USER HAS REVIEWED PRODUCT OR NOT
        const hasReviewedProduct = !!reviews.find(
          (el: ReviewObject) => userId === (el.user_id as UserProfileObject)._id
        );

        res.status(200).json({
          reviewsData: reviews,
          hasReviewedProduct,
          reviews: reviewCount,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Could not find reviews!" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authentication is required!" });
  }
  // const client: any = await ClientPromise;
  // const db = client.db("dhaaga-db");
  // const reviewsColl = await db.collection("reviews");

  // const cookies = nookies.get({ req });

  // let user;
  // if (cookies && cookies.token) {
  //   const token = cookies.token;
  //   try {
  //     user = await firebaseAdmin.auth().verifyIdToken(token);
  //   } catch (err: any) {
  //     console.log(err.message);
  //   }
  // }

  // const userId = user?.uid;

  // const aggForTheRequestAfterCreateReview = [
  //   {
  //     $match: {
  //       product_id: productObjId,
  //     },
  //   },
  //   {
  //     $sort: {
  //       created_date: -1,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "user_id",
  //       foreignField: "_id",
  //       as: "userInfo",
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$userInfo",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       user_id: "$userInfo",
  //     },
  //   },
  //   {
  //     $unset: "userInfo",
  //   },
  //   {
  //     $group: {
  //       _id: "$product_id",
  //       reviews: {
  //         $push: "$$ROOT",
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       ownedReview: {
  //         $filter: {
  //           input: "$reviews",
  //           as: "review",
  //           cond: {
  //             $eq: ["$$review.user_id._id", userId],
  //           },
  //         },
  //       },
  //       notOwnedReviews: {
  //         $filter: {
  //           input: "$reviews",
  //           as: "review",
  //           cond: {
  //             $ne: ["$$review.user_id._id", userId],
  //           },
  //           limit: 2,
  //         },
  //       },
  //       reviewCount: {
  //         $size: "$reviews",
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       reviews: {
  //         $concatArrays: ["$ownedReview", "$notOwnedReviews"],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       ownedReview: 0,
  //       notOwnedReviews: 0,
  //     },
  //   },
  // ];

  // const aggForTheSeeMoreReviewsRequest = [
  //   {
  //     $match: {
  //       product_id: productObjId,
  //     },
  //   },
  //   {
  //     $sort: {
  //       created_date: -1,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "user_id",
  //       foreignField: "_id",
  //       as: "userInfo",
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$userInfo",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       user_id: "$userInfo",
  //     },
  //   },
  //   {
  //     $unset: "userInfo",
  //   },
  //   {
  //     $group: {
  //       _id: "$product_id",
  //       reviews: {
  //         $push: "$$ROOT",
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       ownedReview: {
  //         $filter: {
  //           input: "$reviews",
  //           as: "review",
  //           cond: {
  //             $eq: ["$$review.user_id._id", userId],
  //           },
  //         },
  //       },
  //       notOwnedReviews: {
  //         $filter: {
  //           input: "$reviews",
  //           as: "review",
  //           cond: {
  //             $ne: ["$$review.user_id._id", userId],
  //           },
  //         },
  //       },
  //       reviewCount: {
  //         $size: "$reviews",
  //       },
  //     },
  //   },
  //   {
  //     $addFields: {
  //       reviews: {
  //         $concatArrays: ["$ownedReview", "$notOwnedReviews"],
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       ownedReview: 0,
  //       notOwnedReviews: 0,
  //     },
  //   },
  // ];

  // if (!seeMore) {
  //   // GET ALL REVIEWS RELATED TO THE PRODUCT
  //   const cursor = await reviewsColl.aggregate(
  //     aggForTheRequestAfterCreateReview
  //   );
  //   const result = await cursor.toArray();
  //   const reviews = result[0].reviews;
  //   const reviewCount = result[0].reviewCount;

  //   // CHECK WHETHER THE USER HAS REVIEWED PRODUCT OR NOT
  //   const hasReviewedProduct = !!reviews.find(
  //     (el: ReviewObject) => userId === el.user_id._id
  //   );

  //   res.status(200).json({
  //     reviewsData: reviews,
  //     hasReviewedProduct,
  //     reviews: reviewCount,
  //   });
  // }

  // if (seeMore) {
  //   // GET ALL REVIEWS RELATED TO THE PRODUCT
  //   const cursor = await reviewsColl.aggregate(aggForTheSeeMoreReviewsRequest);
  //   const result = await cursor.toArray();
  //   const reviews = result[0].reviews;
  //   const reviewCount = result[0].reviewCount;

  //   // CHECK WHETHER USER HAS REVIEWED PRODUCT OR NOT
  //   const hasReviewedProduct = !!reviews.find(
  //     (el: ReviewObject) => userId === el.user_id._id
  //   );

  //   res.status(200).json({
  //     reviewsData: reviews,
  //     hasReviewedProduct,
  //     reviews: reviewCount,
  //   });
  // }
}
