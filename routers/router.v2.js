'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

/** RETRIEVE ALL AUTHORS */
router.get('/authors', (req, res, next) => {
  knex.select('id', 'email', 'username')
    .from('authors')
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

/** RETRIEVE ALL STORIES */
router.get('/stories', (req, res, next) => {

  knex
    .select('stories.id', 'title', 'content', 'username as authorName', 'authors.id as authorId')
    .from('stories')
    .innerJoin('authors', 'stories.author_id', 'authors.id')
    .orderBy('created')
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

/** RETRIEVE A SINGLE STORY */
router.get('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    var err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  // Solution using .select() and array destructuring
  knex.select('stories.id', 'title', 'content', 'username as authorName', 'authors.id as authorId')
    .from('stories')
    .innerJoin('authors', 'stories.author_id', 'authors.id')
    .where('stories.id', id)
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
  
 // Ordinary solution using .select()
  /*
    knex.select('stories.id', 'title', 'content', 'username as authorName', 'authors.id as authorId')
    .from('stories')
    .innerJoin('authors', 'stories.author_id', 'authors.id')
    .where('stories.id', id)
    .then( result => {
      if (result) {
        res.json(result[0]);
      } else {
        next();
      }
    })
    .catch(next);
 */

  // Knex solution using .first()
  /* 
    knex.first('stories.id', 'title', 'content', 'username as authorName', 'authors.id as authorId')
    .from('stories')
    .innerJoin('authors', 'stories.author_id', 'authors.id')
    .where('stories.id', id)
    .then( result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);;
  */

});

/** CREATE A STORY */
router.post('/stories', (req, res, next) => {

  const requiredFields = ['title', 'content', 'author_id'];

  if (Object.keys(req.body).length === 0) {
    const err = new Error(`The body must contain: ${requiredFields}`);
    err.status = 400;
    return next(err);
  }

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error(`The body must contain: ${requiredFields} as JSON`);
      err.status = 400;
      return next(err);
    }
  });

  knex
    .insert({
      title: req.body.title,
      content: req.body.content,
      author_id: req.body.author_id
    })
    .into('stories')
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (!result) return next();

      return knex.select('stories.id', 'title', 'content', 'username as authorName', 'authors.id as authorId')
        .from('stories')
        .innerJoin('authors', 'stories.author_id', 'authors.id')
        .where('stories.id', result.id);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);
});

/** MODIFY A STORY */
router.put('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const requiredFields = ['title', 'content', 'author_id'];

  if (Object.keys(req.body).length === 0) {
    const err = new Error(`The body must contain: ${requiredFields} as JSON`);
    err.status = 400;
    return next(err);
  }

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error(`Missing '${field}' in request body`);
      err.status = 400;
      return next(err);
    }
  });

  knex('stories')
    .update({
      title: req.body.title,
      content: req.body.content,
      author_id: req.body.author_id
    })
    .where('id', id)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (!result) {
        next();
        return Promise.reject({
          status: res.status,
          message: res.statusText
        });
      }
      return knex.select('stories.id', 'title', 'content', 'username as authorName', 'authors.id as authorId')
        .from('stories')
        .innerJoin('authors', 'stories.author_id', 'authors.id')
        .where('stories.id', result.id);
    })
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);

});

/** DELETE A STORY */
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
        next();
      }
    })
    .catch(next);
});

module.exports = router;
