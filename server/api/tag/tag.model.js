'use strict';

import mongoose from 'mongoose';

var Schema = mongoose.Schema;
var TagSchema = new mongoose.Schema({
  slug: String,
  name: String,
  description: String,
  active: {type: Boolean, default: true},
  parent: {type: Schema.Types.ObjectId, ref: 'Tag'},
  updated: { type: Date, default: Date.now },
  createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Tag', TagSchema);
