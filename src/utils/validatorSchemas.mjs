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
  birthDate: {
    isDate: {
      errorMessage: "No se ha ingresado una fecha valida"
    },
    optional: true
  },
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

export { createUserValidationSchema, loginUserValidationSchema, updateUserProfileSchema }