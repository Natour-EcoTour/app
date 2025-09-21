import * as yup from 'yup';

export const profileSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório').min(3, 'Nome muito curto'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
});
