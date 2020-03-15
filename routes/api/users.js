const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// You may want to start commenting in information about your routes so 
//    that you can find the appropriate ones quickly.

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        handle: req.user.handle,
        email: req.user.email
    });
})


router.get('/test', (req, res) => {
    res.json({ msg: "this is the ~ user route  ~ "})
});

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne( {email: req.body.email })
    .then(user => {
        if (user){
            // Use the validations to send the error
            errors.email = 'Email already exists';
            return res.status(400).json(errors)
        } else {
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            })

            // newUser.save()
            //     .then(user => res.send(user))
            //     .catch(err => res.send(err))
            // //this was just for testing purpose


            // bcrypt.genSalt( number of rounds to generate salt, cb function to run after salting is done )
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        // .then(user => res.send(user))
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            }  )
        }
    })
})

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                // Use the validations to send the error
                errors.email = 'User not found';
                return res.status(404).json(errors);

            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {
                            id: user.id,
                            handle: user.handle,
                            email: user.email
                        }
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "bearer " + token
                                });
                            }
                        )
                    } else {
                        errors.password = 'Incorrect password bro'
                        return res.status(400).json(errors);
                    }
                })
        })
})

module.exports = router;