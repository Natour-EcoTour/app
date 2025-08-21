import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
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
