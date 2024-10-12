import * as yup from 'yup';

const Regex = {
  username: /^[A-Za-z@_+\-./?0-9]{6,}$/,
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  lowercase: /[a-z]/, // @/./+/-/_
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  symbol: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/,
};

export const schemaRegister = yup.object().shape({
  username: yup
    .string()
    .matches(
      Regex.username,
      'Имя пользователя должно быть минимум 6 символов и содержать латинские символы'
    )
    .required('Имя пользователя обязательное поле'),

  first_name: yup
    .string()
    .required('Имя обязательное поле')
    .matches(/^[\p{Lu}\p{Lt}].*$/u, 'Имя должно начинаться с заглавной буквы'),

  last_name: yup
    .string()
    .required('Фамилия обязательное поле')
    .matches(/^[\p{Lu}\p{Lt}].*$/u, 'Фамилия должна начинаться с заглавной буквы'),

  email: yup
    .string()
    .matches(Regex.email, 'Невалидное значение почты')
    .required('Почта обязательное поле'),

  password: yup
    .string()
    .required('Пароль обязательное поле')
    .test('password-complexity', function (value: string = ''): true | yup.ValidationError {
      const errors = [];

      if (!Regex.lowercase.test(value)) errors.push('Одну строчную букву латинского алфавита');
      if (!Regex.uppercase.test(value)) errors.push('Одну заглавную буква на латыни');
      if (!Regex.number.test(value)) errors.push('Одну цифру');
      if (!Regex.symbol.test(value)) errors.push('Один специальный символ');
      if (value.length < 8) errors.push('Не менее 8 символов');

      if (errors.length > 0) {
        return this.createError({
          message: `Сложность пароля - ${
            5 - errors.length
          }/5: пароль должен содержать как минимум ${errors.join(', ')}`,
        });
      }
      return true;
    }),
});

export const schemaLogin = yup.object().shape({
  username: yup.string().required('Имя пользователя обязательное поле'),

  password: yup.string().required('Пароль обязательное поле'),
});

export const schemaChange = yup.object().shape({
  old_password: yup.string().required('Пароль обязательное поле'),

  password: yup
    .string()
    .required('Пароль обязательное поле')
    .test('password-complexity', function (value: string = ''): true | yup.ValidationError {
      const errors = [];

      if (!Regex.lowercase.test(value)) errors.push('Одну строчную букву латинского алфавита');
      if (!Regex.uppercase.test(value)) errors.push('Одну заглавную буква на латыни');
      if (!Regex.number.test(value)) errors.push('Одну цифру');
      if (!Regex.symbol.test(value)) errors.push('Один специальный символ');
      if (value.length < 8) errors.push('Не менее 8 символов');

      if (errors.length > 0) {
        return this.createError({
          message: `Сложность пароля - ${
            5 - errors.length
          }/5: пароль должен содержать как минимум ${errors.join(', ')}`,
        });
      }
      return true;
    }),

  confirmed_password: yup
    .string()
    .required('Confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const schemaArticle = yup.object().shape({
  title: yup.string().required('Имя пользователя обязательное поле'),

  content: yup.string().required('Пароль обязательное поле'),

  image: yup.mixed().notRequired(),
});

export function isFile(obj: unknown): obj is FileList {
  if (
    typeof obj === 'object' &&
    obj &&
    '0' in obj &&
    typeof obj[0] === 'object' &&
    obj[0] &&
    'size' in obj[0] &&
    typeof obj[0].size === 'number' &&
    'type' in obj[0] &&
    typeof obj[0].type === 'string'
  )
    return true;
  return false;
}
