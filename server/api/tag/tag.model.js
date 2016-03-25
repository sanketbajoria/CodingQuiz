'use strict';

import mongoose from 'mongoose';

var TagSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Tag', TagSchema);
