import * as yup from 'yup';

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