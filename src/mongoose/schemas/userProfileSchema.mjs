import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true
  }
});

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
  birthDate: {
    type: mongoose.Schema.Types.Date,
  },
  favoriteSong: {
    type: mongoose.Schema.Types.String,
    trim: true,
  },
  favoriteArtist: {
    type: mongoose.Schema.Types.String,
    trim: true,
  },
  friends: [userInfoSchema],
  requested: [userInfoSchema],
}, {
  timestamps: true,
  collection: 'user_profile',  // Especifica el nombre de la colección
});

export const UserProfile = mongoose.model('UserProfile', userProfileSchema);