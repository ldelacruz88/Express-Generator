const express = require("express");
const Partner = require("../models/partner");
const authenticate = require("../authenticate");

const partnerRouter = express.Router();

partnerRouter
	.route("/")
	.get((req, res, next) => {
		Partner.find()
			.then((partners) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(partners);
			})
			.catch((err) => next(err));
	})
	.post(
		[authenticate.verifyUser, authenticate.verifyAdmin],
		(req, res, next) => {
			if (req.user.admin) {
				Partner.create(req.body)
					.then((partner) => {
						console.log("Partner Created", partner);
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(partner);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 403;
				res.end("Access denied.");
			}
		}
	)
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end("PUT operation not supported on /partners");
	})
	.delete(
		[authenticate.verifyUser, authenticate.verifyAdmin],
		(req, res, next) => {
			if (req.user.admin) {
				Partner.deleteMany()
					.then((response) => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(response);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 403;
				res.end("Access denied.");
			}
		}
	);

partnerRouter
	.route("/:partnerId")
	.get((req, res, next) => {
		Partner.findById(req.params.partnerId)
			.then((partner) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(partner);
			})
			.catch((err) => next(err));
	})
	.post(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operation not supported on /partners/${req.params.partnerId}`
		);
	})
	.put(
		[authenticate.verifyUser, authenticate.verifyAdmin],
		(req, res, next) => {
			if (req.user.admin) {
				Partner.findByIdAndUpdate(
					req.params.partnerId,
					{
						$set: req.body,
					},
					{ new: true }
				)
					.then((partner) => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(partner);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 403;
				res.end("Access denied.");
			}
		}
	)
	.delete(
		[authenticate.verifyUser, authenticate.verifyAdmin],
		(req, res, next) => {
			if (req.user.admin) {
				Partner.findByIdAndDelete(req.params.partnerId)
					.then((response) => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json(response);
					})
					.catch((err) => next(err));
			} else {
				res.statusCode = 403;
				res.end("Access denied.");
			}
		}
	);

module.exports = partnerRouter;
