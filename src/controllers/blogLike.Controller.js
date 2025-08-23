import { blogLikeService } from "../services/blogLike.service.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createBlogLike = async (req, res, next) => {
  const { blog_id } = req.body;
  const user = req.user;

  try {
    const newBlog = await blogLikeService.likeAndDislikeBlog(blog_id, user.id);
    handleResponse(res, 201, "Blog created successfully", newBlog);
  } catch (error) {
    next(error);
  }
};

const getAllBlogLikes = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const blogLikes = await blogLikeService.getBlogLikes(blogId);

    return handleResponse(
      res,
      200,
      "Blog Likes retrieved successfully",
      blogLikes
    );
  } catch (error) {
    next(error);
  }
};

export const blogLikeController = {
  createBlogLike,
  getAllBlogLikes,
};
