# EcommerceBackend

## Project Objective

1. **Category Management**
   CRUD Ctageory
2. **Brand Management**  
  Handle Brand Managemnt

3. **Product Management**  
   Hnadle Product Managemnt

4. **Review System**  
   Allow users to add the review if customer is login only.

5. **Role Managment
   allow only admin to create staff and other brand , productr, category to be done by both admin and staff

## Key Learning

   FrontEnd Learning
   
   - Learned about browser storage 
   - Learned about async operation handling.
   - Learned the appproach of segrettating the project that is running through separte domain.
   - Making the design Responsive and using position property.
   - utilizing the useState and useEffect for api integration.
   - learned about using redux tool kit for globalstate managemnt
   - Learned about axios and axios interceptors for sharing the same baseURL and  error and success handling respectively
     React Router Dom
   - Make own private Route without using protected compoment of react router-dom
   - Learned about Layout with implementaion as well
   - Learned about Outlet with implementaion as well
   - Learned about nesting route  with implementaion as well
   - Learned about tanstackquery.


   Backend Learning
   - Learned about Databse design with implementation
   - Learned about api routing for file deletion in edit feature wih implemnataion
   - Improved the image optimization uisng latest feature of cloudinary.
   - Learned about mongoose ORM with implementataion
   - Learned about referncing approach for including category and brand in Product with implemenation
   - Learned about mongodb backup .
   - Learned about using making API Testing meachnism more easier saving for acessing the baseURL in enironment  using Postman
   - Learned about mongodbcompass and atlas with implemenbtaion and run multiple mongodb server via different ports with implemenation
   - Learned about cross origin request, prefligt request, and solved the cors error
   - Learned about embeded approach modeling db through mongodb with implementaion
   - Learned about built middleware, custom middleware for exaching the json response via api  with implmeneation as well.
 

   Security Learning
      - Learned about cross site scripting
      - learned about DDOS attack and got awareness how to mitigate this issue
      - Learned about advertsiment of express does.


   Continous Deployemnt
      - Learned about automating deployemnt ussing gituub workflow when pushed to github takes place (that is reflecting in domain as soon as pushed takesplace) with implemntaion as           well
      - Learned about accesing the cpanel server without seeing through ui of cpanel server using terminal with implementaion as well
      - Learned about docker image and docker container and run the server in another enviroment
## How to Run This Backend Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server in watch mode:

   ```bash
   node --watch index.js
   ```

3. Ensure MongoDB is running and connected via the `Mongodb_URI` in your `.env` file.

## API Endpoints

### Categories

- **Create Category**: `POST /api/categories`
- **Get All Categories**: `GET /api/categories`

### Subcategories

- **Create SubCategory**: `POST /api/subcategories`
- **Get All SubCategories**: `GET /api/subcategories`
- **Delete SubCategory**: `DELETE /api/subcategories/:id`

### Products

- **Create Product**: `POST /api/products`
- **Get All Products**: `GET /api/products`
- **Get Product by ID**: `GET /api/products/:id`
- **Delete Product**: `DELETE /api/products/:id`

### Brands

- **Create Brand**: `POST /api/brands`
- **Get All Brands**: `GET /api/brands`
- **Delete Brand**: `DELETE /api/brands/:id`

### Orders

- **Create Order**: `POST /api/orders`
- **Get All Orders**: `GET /api/orders`
- **Delete Order**: `DELETE /api/orders/:id`

### Reviews

- **Add Review**: `POST /api/products/:id/reviews`

## Notes

- Ensure all required fields are provided in the request body for POST and PUT endpoints.
- Use tools like Postman or curl to test the API endpoints.
- Check the logs for any errors during development.
