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
        cep: yup.string().optional(),
        city: yup.string().optional(),
        neighborhood: yup.string().optional(),
        number: yup.string().optional(),
        street: yup.string().optional(),
        uf: yup.string().optional(),
        latitude: yup.string().required('Latitude é obrigatória'),
        longitude: yup.string().required('Longitude é obrigatória'),
    }),
    type: yup.string().required('Tipo do ponto é obrigatório'),
    images: yup.array().min(1, 'Pelo menos uma imagem é obrigatória').required('Pelo menos uma imagem é obrigatória'),
});