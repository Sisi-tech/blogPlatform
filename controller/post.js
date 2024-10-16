const Post = require('../models/Post');
const { StatusCodes, RESET_CONTENT } = require('http-status-codes');
const { BadRequestError } = require('../errors/bad_request');
const { NotFoundError } = require('../errors/not_found')

const getAllPosts = async (req, res) => {
    const posts = await Post.find({ createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({ posts, count: posts.length });
}

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
        req.body.createdBy = req.user.userId;
        const post = await Post.create(req.body);
        res.status(StatusCodes.CREATED).json({ post });
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new BadRequestError(error.message);
        }
        throw error;
    }
}

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
