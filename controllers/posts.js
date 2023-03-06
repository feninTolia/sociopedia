import Post from '../models/Post.js';
import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    const result = cloudinary.uploader.upload(picturePath, {
      folder: 'posts',
    });

    console.log(result);

    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (e) {
    res.status(409).json({ msg: e.message });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};
