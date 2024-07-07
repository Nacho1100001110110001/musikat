import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    comment: {
      type: mongoose.Schema.Types.String,
      required: true
    }
  });

const publicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  publicationDate: {
    type: mongoose.Schema.Types.Date,
  },
  artistId: {
    type: mongoose.Schema.Types.String,
    trim: true,
  },
  songId: {
    type: mongoose.Schema.Types.String,
    trim: true,
  },
  content: {
    type: mongoose.Schema.Types.String,
    required: true,
    trim: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likeCount: {
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  comments: [commentSchema]
}, {
  timestamps: true,
  collection: 'publication',  // Especifica el nombre de la colección
});

export const Publication = mongoose.model('publication', publicationSchema);