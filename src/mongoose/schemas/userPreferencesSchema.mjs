import mongoose from "mongoose";


const userPreferecesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  likedSongs: [{
    type: mongoose.Schema.Types.String,
    trim: true,
  }],
  likedArtists: [{
    type: mongoose.Schema.Types.String,
    trim: true,
  }]
}, {
  timestamps: true,
  collection: 'user_preferences',  // Especifica el nombre de la colección
});

export const UserPreferences = mongoose.model('UserPreferences', userPreferecesSchema);
