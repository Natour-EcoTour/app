import * as yup from 'yup';

export const newPasswordSchema = yup.object().shape({
    currentPassword: yup.string().required('Senha atual é obrigatória'),
    newPassword: yup
        .string()
        .required('Senha é obrigatória')
        .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
            'A senha deve ter pelo menos:\n8 caracteres\n1 letra maiúscula\n1 caractere especial'
        ),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'As senhas devem corresponder'),
});