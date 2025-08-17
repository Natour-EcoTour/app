import * as yup from 'yup';

// const isValidCPF = (cpf: string): boolean => {
//   cpf = cpf.replace(/\D/g, '');
//   if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

//   let sum = 0;
//   let remainder: number;

//   for (let i = 0; i < 9; i++) {
//     sum += parseInt(cpf.charAt(i)) * (10 - i);
//   }
//   remainder = sum % 11;
//   const digit1 = remainder < 2 ? 0 : 11 - remainder;
//   if (parseInt(cpf.charAt(9)) !== digit1) return false;

//   sum = 0;
//   for (let i = 0; i < 10; i++) {
//     sum += parseInt(cpf.charAt(i)) * (11 - i);
//   }
//   remainder = sum % 11;
//   const digit2 = remainder < 2 ? 0 : 11 - remainder;

//   return parseInt(cpf.charAt(10)) === digit2;
// };

export const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  // cpf: yup
  //   .string()
  //   .required('CPF é obrigatório')
  //   .test('is-valid-cpf', 'CPF inválido', (value) => isValidCPF(value || '')),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      'A senha deve ter pelo menos:\n8 caracteres\n1 letra maiúscula\n1 caractere especial'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Senhas não são idênticas')
    .required('Confirmação de senha é obrigatória'),
  termsAccept: yup
    .boolean()
    .oneOf([true], 'Você deve aceitar os termos e condições')
    .required('Você deve aceitar os termos e condições'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      'A senha deve ter pelo menos:\n8 caracteres\n1 letra maiúscula\n1 caractere especial'
    ),
});

export default { registerSchema, loginSchema };

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
});

export const registerPointSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
  description: yup.string().required('Descrição é obrigatória'),
  link: yup.string().url('URL inválida'),
  time: yup.object().shape({
    weekStart: yup.string().required('Dia da semana é obrigatório'),
    weekEnd: yup.string().required('Dia da semana é obrigatório'),
    timeStart: yup.string().required('Horário de início é obrigatório'),
    timeEnd: yup.string().required('Horário de término é obrigatório'),
  }),
  address: yup.object().shape({
    cep: yup.string().required('CEP é obrigatório'),
    city: yup.string().required('Cidade é obrigatória'),
    neighborhood: yup.string().required('Bairro é obrigatório'),
    number: yup.string().required('Número é obrigatório'),
    street: yup.string().required('Rua é obrigatória'),
    uf: yup.string().required('UF é obrigatória'),
    latitude: yup.string().optional(),
    longitude: yup.string().optional(),
  }),
  type: yup.string().required('Tipo do ponto é obrigatório'),
});
