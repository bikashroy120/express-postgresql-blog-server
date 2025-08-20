import { blogsServices } from "../services/blog.services.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createBlog = async (req, res, next) => {
  const { title, content, category } = req.body;
  const user = req.user;

  try {
    const newBlog = await blogsServices.createBlog(
      title,
      user.id,
      content,
      category
    );
    handleResponse(res, 201, "Blog created successfully", newBlog);
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sort = "createdAt",
      order = "DESC",
      title,
    } = req.query;

    const blogs = await blogsServices.getAllBlogs({
      page,
      limit,
      category,
      title,
      sort,
      order,
    });

    return handleResponse(res, 200, "Blogs retrieved successfully", blogs);
  } catch (error) {
    next(error);
  }
};

const getSingleBlog = async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const blog = await blogsServices.getBlogById(blogId);
    if (!blog) {
      return handleResponse(res, 404, "Blog not found");
    }
    return handleResponse(res, 200, "Blog retrieved successfully", blog);
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, content, category } = req.body;

  try {
    const updatedBlog = await blogsServices.updateBlog(blogId, {
      title,
      content,
      category,
    });
    return handleResponse(res, 200, "Blog updated successfully", updatedBlog);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const deletedBlog = await blogsServices.deleteBlog(blogId);
    return handleResponse(res, 200, "Blog deleted successfully", deletedBlog);
  } catch (error) {
    next(error);
  }
};

export const blogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
