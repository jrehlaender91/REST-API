'use strict';

const express = require('express');
const { authenticateUser } = require('./middleware/auth-user');
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;
const bcrypt = require('bcrypt');
const { sequelize, models } = require('./models');


function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// Route that returns the current authenticated user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } else {
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
        });
        res.status(200).json();
    }
}));

// /api/users - POST: This route should create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).setHeader('Location', '/').end();
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// /api/courses - GET: Return all courses including the User object associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'emailAddress'],
        }],
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
    });
    res.json(courses);
    res.status(200).json();
}));

// /api/courses/:id - GET: Return the corresponding course including the User object associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findAll({
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'emailAddress'],
        }],
        where: { id: req.params.id },
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
    });

    if (course) {
        res.json(course);
        res.status(200).json();
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
}));

// /api/courses - POST: Create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(201).setHeader('Location', '/api/courses/' + newCourse.id).end();
    } catch (error) {
        console.log('ERROR: ', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// /api/courses/:id - PUT: Update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    const course = await Course.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'emailAddress'],
        }],
    });
    if (user.emailAddress !== course.user.emailAddress) {
        return res.status(403).json();
    } else {
        if (course) {
            try {
                await course.update(req.body);
                res.status(204).json();
            } catch (error) {
                console.log('ERROR: ', error.name);

                if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                    const errors = error.errors.map(err => err.message);
                    res.status(400).json({ errors });
                } else {
                    throw error;
                }
            }
        }
    }
}));

// /api/courses/:id - DELETE: Delete the corresponding course and return a 204 HTTP status code and no content.
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).json();
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
}));

module.exports = router;