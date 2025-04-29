
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a module
const createModule = (moduleName) => {
  // Define paths
  const modulePath = path.join(__dirname, 'src', 'app', 'modules', moduleName);

  // Check if the module already exists
  if (fs.existsSync(modulePath)) {
    console.error(`Module "${moduleName}" already exists.`);
    return;
  }

  // Create the module folder
  fs.mkdirSync(modulePath, { recursive: true });

  // Define files and their default content
  const files = [
    {
      name: `${moduleName}.constant.ts`,
      content: `export const ${capitalize(moduleName)}SearchableFields = ['name', 'description'];\n
export const ${capitalize(moduleName)}ValidFields: string[] = [
  "searchTerm",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
  "status",
  "gender"
];
      
      `,
    },
    {
      name: `${moduleName}.interface.ts`,
      content: `

export interface I${capitalize(moduleName)} {
  name: string;
  description?: string;
};

export type T${capitalize(moduleName)}Query = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
`,
    },
    {
      name: `${moduleName}.controller.ts`,
      content: `import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { create${capitalize(moduleName)}Service, getSingle${capitalize(moduleName)}Service, getAll${capitalize(moduleName)}sService, update${capitalize(moduleName)}Service, delete${capitalize(moduleName)}Service } from './${moduleName}.service';

const create${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const result = await create${capitalize(moduleName)}Service(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: '${capitalize(moduleName)} is created successfully',
    data: result,
  });
});

const getSingle${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingle${capitalize(moduleName)}Service(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${capitalize(moduleName)} is retrieved successfully',
    data: result,
  });
});

const getAll${capitalize(moduleName)}s = catchAsync(async (req, res) => {
  const result = await getAll${capitalize(moduleName)}sService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${capitalize(moduleName)}s are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const update${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await update${capitalize(moduleName)}Service(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${capitalize(moduleName)} is updated successfully',
    data: result,
  });
});

const delete${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await delete${capitalize(moduleName)}Service(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${capitalize(moduleName)} is deleted successfully',
    data: result,
  });
});

const ${capitalize(moduleName)}Controller = {
  create${capitalize(moduleName)},
  getSingle${capitalize(moduleName)},
  getAll${capitalize(moduleName)}s,
  update${capitalize(moduleName)},
  delete${capitalize(moduleName)},
};
export default ${capitalize(moduleName)}Controller;
`,
    },
    {
      name: `${moduleName}.route.ts`,
      content: `import express from 'express';
import ${capitalize(moduleName)}Controller from './${moduleName}.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { create${capitalize(moduleName)}ValidationSchema, update${capitalize(moduleName)}ValidationSchema } from './${moduleName}.validation';

const router = express.Router();

router.post(
  '/create-${moduleName.toLowerCase()}',
  validationMiddleware(create${capitalize(moduleName)}ValidationSchema),
  ${capitalize(moduleName)}Controller.create${capitalize(moduleName)},
);

router.get(
  '/get-single-${moduleName.toLowerCase()}/:${moduleName.toLowerCase()}Id',
  ${capitalize(moduleName)}Controller.getSingle${capitalize(moduleName)},
);

router.patch(
  '/update-${moduleName.toLowerCase()}/:${moduleName.toLowerCase()}Id',
  validationMiddleware(update${capitalize(moduleName)}ValidationSchema),
  ${capitalize(moduleName)}Controller.update${capitalize(moduleName)},
);

router.delete(
  '/delete-${moduleName.toLowerCase()}/:${moduleName.toLowerCase()}Id',
  ${capitalize(moduleName)}Controller.delete${capitalize(moduleName)},
);

router.get(
  '/get-all-${moduleName.toLowerCase()}s',
  ${capitalize(moduleName)}Controller.getAll${capitalize(moduleName)}s,
);

const ${capitalize(moduleName)}Routes = router;
export default ${capitalize(moduleName)}Routes;
`,
    },
    {
      // Updated service content
      name: `${moduleName}.service.ts`,
      content: `/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError';
import { ${capitalize(moduleName)}SearchableFields } from './${moduleName}.constant';
import mongoose from 'mongoose';
import { I${capitalize(moduleName)}, T${capitalize(moduleName)}Query } from './${moduleName}.interface';
import ${capitalize(moduleName)}Model from './${moduleName}.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';

const create${capitalize(moduleName)}Service = async (
  payload: I${capitalize(moduleName)},
) => {
  const result = await ${capitalize(moduleName)}Model.create(payload);
  
  if (!result) {
    throw new AppError(400, 'Failed to create ${capitalize(moduleName)}');
  }

  return result;
};

const getAll${capitalize(moduleName)}sService = async (query: T${capitalize(moduleName)}Query) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, ${capitalize(moduleName)}SearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ${moduleName}Model.aggregate([
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender:1,
        role: 1,
        status: 1,
        profileImg: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalReviewResult = await ${moduleName}Model.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getSingle${capitalize(moduleName)}Service = async (id: string) => {
  const result = await ${capitalize(moduleName)}Model.findById(id);
  if (!result) {
    throw new AppError(404, '${capitalize(moduleName)} Not Found');
  }

  return result;
};

const update${capitalize(moduleName)}Service = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('${moduleName.toLowerCase()}s')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('${capitalize(moduleName)} not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted ${moduleName}');
  }

  const updatedData = await ${capitalize(moduleName)}Model.updateOne(
    { _id: id },
    payload,
  );



  return updatedData;
};

const delete${capitalize(moduleName)}Service = async (id: string) => {
  const deletedService = await ${capitalize(moduleName)}Model.deleteOne({ _id:id });

  if (!deletedService) {
    throw new AppError(400, 'Failed to delete ${capitalize(moduleName)}');
  }

  return deletedService;
};

export {
  create${capitalize(moduleName)}Service,
  getAll${capitalize(moduleName)}sService,
  getSingle${capitalize(moduleName)}Service,
  update${capitalize(moduleName)}Service,
  delete${capitalize(moduleName)}Service,
};
`,
    },
    {
        name: `${moduleName}.model.ts`,
        content: `import { Schema, model } from 'mongoose';
import { I${capitalize(moduleName)} } from './${moduleName}.interface';
      
const ${moduleName.toLowerCase()}Schema = new Schema<I${capitalize(moduleName)}>({
  name: { 
    type: String,
    required: true
  },
  description: { 
    type: String
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const ${capitalize(moduleName)}Model = model<I${capitalize(moduleName)}>('${capitalize(moduleName)}', ${moduleName.toLowerCase()}Schema);
export default ${capitalize(moduleName)}Model;
      `,
    },
    {
      name: `${moduleName}.validation.ts`,
      content: `import { z } from 'zod';

export const create${capitalize(moduleName)}ValidationSchema = z.object({
   name: z.string({
    required_error: "name is required!"
  }),
  description: z.string({
    required_error: "description is required !"
  }),
});

export const update${capitalize(moduleName)}ValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
`,
    },
  ];
  // Create files with default content
  files.forEach((file) => {
    const filePath = path.join(modulePath, file.name);
    fs.writeFileSync(filePath, file.content);
  });

  console.log(`Module "${moduleName}" has been created successfully.`);
};

// Utility function to capitalize module names
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Get the module name from the command line arguments
const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

// Create the module
createModule(moduleName);

