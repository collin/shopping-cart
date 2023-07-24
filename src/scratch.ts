import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().int().positive(),
  pageSize: z.coerce.number().int().positive(),
});

const pageParams = paginationSchema.parse({
  page: "1",
  pageSize: "10",
});

console.log(pageParams);

// const objectJson = JSON.stringify(object);
// console.log(objectJson);
// const parsedObject = JSON.parse(objectJson);

// const verifiedObject = schema.parse(parsedObject);

// console.log(verifiedObject);
