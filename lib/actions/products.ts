// start by creating a new server action that will allow us to create a new Product in the database. We will create a new file called products.ts in the lib/actions directory.
// import our generated Prisma Client

"use server";
import { revalidateTag, unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  // update our type to accept an array of image URLs
  images?: string[];
}

export async function createProduct(product: CreateProductInput) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: {
          create: product.images?.map((url) => ({ url })),
        },
      },
    });
    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
}

// read a Product from the database

async function _getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: true,
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

export const getProductById = unstable_cache(_getProductById, ["getProductById"], {
  tags: ["Product"],
  revalidate: 60, // Re-fetch the data every 60 seconds
});

// Update a Product server action.- the update is a bit of a combination of the create and read operations. You need to find the record first, then update the data.
export async function updateProduct(id: number, product: CreateProductInput) {
  try {
    const updatedProduct = await prisma.product.update({
      // where statement, just like reading a record
      where: { id },
      // data object is the exact same as 'create'.
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: {
          // delete previous images and create new ones
          deleteMany: {},
          create: product.images?.map((url) => ({ url })),
        },
      },
    });

    // Mark the data as stale, and re-fetch it from the database
    revalidateTag("Product");
    return updatedProduct;
  } catch (error) {
    return null;
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    // Mark the data as stale, and re-fetch it from the database
    revalidateTag("Product");
    return true;
  } catch (error) {
    return false;
  }
}