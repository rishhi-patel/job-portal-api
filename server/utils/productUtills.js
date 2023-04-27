const { map, some, forEach, find } = require("lodash")
const Product = require("../models/productModel")

function removeDuplicateAndSetMainProduct(objectIDs, ProductID) {
  const ids = {}
  objectIDs.forEach(
    (elem) => (ids[elem.value.toString()] = { ...elem, mainProduct: false })
  )
  if (ProductID)
    ids[ProductID.toString()] = {
      ...ids[ProductID.toString()],
      mainProduct: true,
    }
  return Object.values(ids)
}

function containsObject(obj, list) {
  let i
  for (i = 0; i < list.length; i++) {
    if (list[i].value.toString() == obj.value.toString()) return true
  }
  return false
}

const synchronizeProductRelations = async (records = [], dataToSync, obj) => {
  try {
    const { value: ProductID } = obj
    let result = obj ? [...records, obj] : records
    const { [dataToSync]: serverData } = await Product.findById(ProductID)
      .select(dataToSync)
      .lean()
    const difference = serverData.filter((x) => !containsObject(x, records))

    if (difference.length) {
      // remove current product from other products
      await Promise.all(
        difference.map(async ({ value }) => {
          const { [dataToSync]: res } = await Product.findById(value)
            .select(dataToSync)
            .lean()
          const updated = res.filter(
            (x) => x.value.toString() !== ProductID.toString()
          )
          await Product.findOneAndUpdate(
            { _id: value },
            {
              [dataToSync]: updated,
            }
          )
        })
      )
    }
    await Promise.all(
      [...records].map(async ({ value }) => {
        const { [dataToSync]: response } = await Product.findById(value)
          .select(dataToSync)
          .lean()
        result = [...result, ...response]
      })
    )
    const uniqIds = removeDuplicateAndSetMainProduct(result)
    if (uniqIds.length)
      await Promise.all(
        uniqIds.map(async ({ value }) => {
          await Product.findOneAndUpdate(
            { _id: value },
            {
              [dataToSync]: removeDuplicateAndSetMainProduct(result, value),
            }
          )
        })
      )
  } catch (error) {
    console.log(error)
  }
}

const calculateTotal = (products) => {
  const elementCounts = { mrp: 0, price: 0 }

  forEach(products, ({ mrp, price, qty }) => {
    elementCounts["mrp"] = elementCounts["mrp"] + mrp * qty
    elementCounts["price"] = elementCounts["price"] + price * qty
  })
  return elementCounts
}

const countCartTotal = (products) => {
  const elementCounts = {}
  products.forEach((elem) => {
    if (elem.value) {
      const {
        value: { _id, price, mrp },
      } = elem
      elementCounts[_id.toString()] = { qty: elem.qty, price, mrp }
    }
  })

  const updatedProducts = []
  Object.keys(elementCounts).map((elem) => {
    if (elementCounts[elem.toString()])
      updatedProducts.push({
        value: elem,
        qty: elementCounts[elem.toString()].qty,
        totalPrice:
          elementCounts[elem.toString()].price *
          elementCounts[elem.toString()].qty,
      })
  })
  const { mrp, price } = calculateTotal(Object.values(elementCounts))

  return {
    products: updatedProducts,
    total: price,
    subTotal: mrp,
    discount: mrp - price,
    tax: 0,
  }
}

const checkWishListStatus = (products, user) => {
  return map(products, (elem) => {
    elem.inWishlist =
      elem.wishList && user
        ? some(elem.wishList, (wish) => wish.toString() === user._id.toString())
        : false
    return elem
  })
}

const checkReviewLikeDislike = (product, id) => {
  product.reviews = map(product.reviews, (review) => {
    review.isLiked = find(
      review.likedBy,
      (el) => el.toString() === id.toString()
    )
      ? true
      : false
    review.isDisliked = find(
      review.disLikedBy,
      (el) => el.toString() === id.toString()
    )
      ? true
      : false

    review.likeCount = review.likedBy.length
    review.disLikeCount = review.disLikedBy.length
    return review
  })
  return product
}

const getOrderItems = (orderList, user_id) => {
  let response = []

  map(orderList, (order) => {
    const { currentOrderStatus, _id: orderId, orderItems } = order
    map(orderItems, (item) => {
      const {
        name,
        image,
        product: { reviews, _id },
      } = item
      const alreadyReviewed = reviews
        ? Boolean(reviews.find((r) => r.user.toString() === user_id.toString()))
        : false
      response.push({
        alreadyReviewed,
        currentOrderStatus,
        orderId,
        image,
        name,
        _id,
      })
    })
  })
  return response
}

const userItemsWithReviews = (orderItems, user_id) => {
  return map(orderItems, (item) => {
    const {
      product: { reviews, nonVeg, flavour },
    } = item
    const alreadyReviewed = reviews
      ? Boolean(reviews.find((r) => r.user.toString() === user_id.toString()))
      : false
    item.alreadyReviewed = alreadyReviewed
    item.userReview = reviews.find(
      (r) => r.user.toString() === user_id.toString()
    )
    item.nonVeg = nonVeg
    item.flavour = flavour
    delete item.product
    return item
  })
}
module.exports = {
  synchronizeProductRelations,
  countCartTotal,
  checkWishListStatus,
  checkReviewLikeDislike,
  getOrderItems,
  userItemsWithReviews,
}
