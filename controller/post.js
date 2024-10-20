const Post = require('../models/Post');
const { StatusCodes, RESET_CONTENT } = require('http-status-codes');
const { BadRequestError } = require('../errors/bad_request');
const { NotFoundError } = require('../errors/not_found')

const getAllPosts = async (req, res) => {
    const posts = await Post.find({ createdBy: req.user.userId }).sort('createdAt');
    console.log('Fetched Posts:', posts); // Log to see what's fetched

    if (!posts) {
        return res.status(StatusCodes.OK).json({ posts: [], count: 0 }); // Handle case where posts is undefined
    }

    res.status(StatusCodes.OK).json({ posts, count: posts.length });
};


const getPost = async (req, res) => {
    const { user: { userId }, params:{id: postId} } = req;
    const post = await Post.findOne({
        _id: postId, createdBy: userId 
    });
    if (!post) {
        throw new NotFoundError(`No post with id ${postId}`);
    }
    res.status(StatusCodes.OK).json({ post });
}

const createPost = async (req, res) => {
    try {
        console.log('User:', req.user); // Log the user object
        req.body.createdBy = req.user.userId; // Set createdBy field
        const post = await Post.create(req.body);
        res.status(StatusCodes.CREATED).json({ post });
    } catch (error) {
        console.error('Error creating post:', error); // Log error
        if (error.name === 'ValidationError') {
            throw new BadRequestError(error.message);
        }
        throw error; // Rethrow unhandled errors
    }
};


const updatePost = async (req, res) => {
    const {
        body: { picture, title, content},
        user: { userId },
        params: { id: postId }
    } = req 
    if (title === "" || content === "") {
        throw new BadRequestError('Title or content fields cannot be empty');
    }
    const post = await Post.findOneAndUpdate(
        { _id: postId, createdBy: userId}, 
        req.body, 
        {new: true, runValidators: true}
    );
    if (!post) {
        throw new NotFoundError(`No post with id ${postId}`)
    }
    res.status(StatusCodes.OK).json({ post })
}

const deletePost = async (req, res) => {
    const {
        user: { userId },
        params: { id: postId },
    } = req;

    const post = await Post.findOneAndDelete({
        _id: postId,
        createdBy: userId
    });
    if (!post) {
        throw new NotFoundError(`No post with id ${postId}`)
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
}
