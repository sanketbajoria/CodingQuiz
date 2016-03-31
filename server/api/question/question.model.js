'use strict';

import mongoose from 'mongoose';

var Schema = mongoose.Schema;
var QuestionSchema = new mongoose.Schema({
  question: String, //Question string
  level: { type: String, enum: ['beginner', 'intermediate', 'expert']},
  answer: String,  //Answer string
  references: [String], //Any other references link
  status: { type: String, enum: ['draft', 'published', 'archived', 'removed']}, //Status for the question, maybe in draft, published, removed status
  tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}], //Array of tags for the question.
  updated: { type: Date, default: Date.now }, //
  createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Question', QuestionSchema);
