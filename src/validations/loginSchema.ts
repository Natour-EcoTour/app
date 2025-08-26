import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    password: yup
        .string()
        .required('Senha é obrigatória')
        .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
            'A senha deve ter pelo menos:\n8 caracteres\n1 letra maiúscula\n1 caractere especial'
        ),
    rememberMe: yup.boolean().required(),
});
