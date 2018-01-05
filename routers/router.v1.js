'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res, next) => {
  knex.select('id', 'title', 'content', 'created')
    .from('stories')
    .orderBy('created')
    .then(results => {
      res.json(results);
    })
    .catch(next); // invoke error handler
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    const err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  knex('stories')
    .select('stories.id', 'title', 'content')
    .where('stories.id', id)
    .then(([result]) => {
      if (result) {
        res.status(200).json(result);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(next); // invoke error handler
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res, next) => {
  const { title, content } = req.body;

  /***** Never Trust Users! *****/
  if (!req.body.title) {
    const err = new Error('Request must contain a title');
    err.status = 400;
    return next(err);
  }

  knex('stories')
    .insert({ title, content })
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next); // invoke error handler
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    const err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  if (!req.body.title) {
    const err = new Error('Request must contain a title');
    err.status = 400;
    return next(err);
  }

  knex('stories')
    .update({ title, content })
    .where('id', id)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(next); // invoke error handler
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    const err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  knex('stories')
    .del()
    .where('id', id)
    .then(result => {
      if (result) {
        res.sendStatus(204);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(next); // invoke error handler
});

module.exports = router;