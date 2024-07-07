
const createUserValidationSchema = {
    email: {
        isEmail: {
          errorMessage: "Ingrese email valido",
        },
        notEmpty: {
          errorMessage: "Email no puede estar vacio",
        },
    },
    username: {
      isLength: {
        options: {
          min: 5,
          max: 32,
        },
        errorMessage:
          "Username must be at least 5 characters with a max of 32 characters",
      },
      notEmpty: {
        errorMessage: "El usuario no puede estar vacio",
      },
      isString: {
        errorMessage: "Usuario debe ser un string",
      },
	  },
    password: {
      notEmpty: {
        errorMessage: "La contraseña no debe estar vacia"
      },
    },
};

const loginUserValidationSchema = {
    email: {
      isEmail: {
        errorMessage: "Ingrese email valido",
      },
      notEmpty: {
        errorMessage: "El email no debe estar vacio",
      },
    },
    password: {
      notEmpty: {
        errorMessage: "La contraseña no debe estar vacia",
      },
    },
};

const updateUserProfileSchema = {
  favoriteSong: {
    isString: {
      errorMessage: "debe ingresar un string"
    },
    optional: true
  },
  favoriteArtist: {
    isString: {
      errorMessage: "debe ingresar un string"
    },
    optional: true
  },
  favoriteGenre: {
    isString: {
      errorMessage: "debe ingresar un string"
    },
    optional: true
  }
}

const createPublicationSchema = {
  songId: {
    isString: true
  },
  artistId: {
    isString: true
  },
  content: {
    isString: true,
    notEmpty: {
      errorMessage: "la publicación no puede estar vacia",
    },
    isLength: {
      options: {
        min: 1,
        max: 255
      },
      errorMonitor: "la publicacion puede ser de hasta 255 caracteres"
    }
  }
}

const createCommentSchema = {
  comment: {
    isString: true,
    notEmpty: {
      errorMessage: "El comentario no puede estar vacio",
    },
    isLength: {
      options: {
        min: 1,
        max: 255
      },
      errorMonitor: "El Mensaje puede ser de hasta 255 caracteres"
    }
  }
}

export { createCommentSchema, createPublicationSchema,
  createUserValidationSchema, loginUserValidationSchema, 
  updateUserProfileSchema }