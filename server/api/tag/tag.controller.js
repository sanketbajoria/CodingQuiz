/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tags              ->  index
 * POST    /api/tags              ->  create
 * GET     /api/tags/:id          ->  show
 * PUT     /api/tags/:id          ->  update
 * DELETE  /api/tags/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Tag from './tag.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeChildEntity(res) {
  return function(entity) {
    if (entity) {
      return Tag.remove({parent: entity._id})
                .exec().then(() => {
                    return entity;
                });
    }
  };
}


function removeAllEntity(res) {
  return function() {
    res.status(204).end();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Tags
export function index(req, res) {
  return Tag.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Tag from the DB
export function show(req, res) {
  return Tag.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Tag in the DB
export function create(req, res) {
  return Tag.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Tag in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Tag.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Tag from the DB
export function destroy(req, res) {
  return Tag.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeChildEntity(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Deletes all Tag from the DB
export function destroyAll(req, res) {
  return Tag.remove({_id: {$in:req.body.tags}}).exec()
    .then(removeAllEntity(res))
    .catch(handleError(res));
}
