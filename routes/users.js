const express = require("express");
const router = express.Router();

const { pool } = require("../utils/dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const catchAsync = require('../utils/catchAsync')
require("dotenv").config();


router.get("/register", checkAuthenticated, catchAsync(async(req, res) => {
    res.render("users/register.ejs");
}));

router.get("/login", checkAuthenticated, catchAsync(async(req, res) => {
    // flash sets a messages variable. passport sets the error message

    res.render("users/login.ejs");
}))

router.get("/dashboard", checkNotAuthenticated, catchAsync(async(req, res) => {
    res.render("dashboard", { user: req.user.name });
}))

router.get("/logout", catchAsync(async(req, res) => {
    req.logout();
    res.render("users/login.ejs", { message: "You have logged out successfully" });
}))

router.post("/register", catchAsync(async(req, res) => {
    let { name, email, password, password2 } = req.body;

    let errors = [];


    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render("register", { errors, name, email, password, password2 });
    } else {
        hashedPassword = await bcrypt.hash(password, 10);

        // Validation passed
        pool.query(
            `SELECT * FROM users
        WHERE email = $1`, [email],
            (err, results) => {
                if (err) {

                }


                if (results.rows.length > 0) {
                    return res.render("register", {
                        message: "Email already registered"
                    });
                } else {

                    pool.query(
                        `INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`, [name, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }

                            req.flash("success", "You are now registered. Please log in");
                            res.redirect("login");
                        }
                    );
                }
            }
        );
    }
}))

router.post("/login", passport.authenticate("local", { failureRedirect: "/users/login", failureFlash: true }),
    catchAsync(async function(req, res) {
        const redirectUrl = req.session.returnTo || '/'
        console.log(req.user)
        req.session.user = req.user
        req.session.save(function(err) {
            req.flash("success", "You are now logged in.");
            res.redirect(redirectUrl);
        });

    }))



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;