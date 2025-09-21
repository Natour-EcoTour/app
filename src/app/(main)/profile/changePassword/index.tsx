import { changeUserPassword } from '@/services/user/changePasswordService';
import CustomModal from '@/src/components/CustomModal';
import PasswordInput from '@/src/components/PasswordInput';
import { images } from '@/src/utils/assets';
import { displayValidationErrors } from '@/src/utils/errorHandling';
import { newPasswordSchema } from '@/src/validations/newPasswordSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { use, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet, Text, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

interface FormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function changePassword() {
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(newPasswordSchema)
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            await changeUserPassword(
                data.currentPassword,
                data.newPassword,
                data.confirmPassword
            );
            setModalVisible(true);
            setIsLoading(false);
        } catch (error: any) {
            if (error.isValidationError && error.data) {
                displayValidationErrors(error.data, 'Erro ao alterar senha');
            }
        }
    };

    return (
        <ImageBackground
            source={images.background}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Controller
                    control={control as any}
                    name="currentPassword"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <PasswordInput
                                label="Senha atual"
                                placeholder="Insira sua senha atual"
                                value={value || ''}
                                onChange={onChange}
                            />
                            {errors.currentPassword && (
                                <Text style={styles.error}>
                                    {errors.currentPassword.message}
                                </Text>
                            )}
                        </>
                    )}
                />

                <Controller
                    control={control as any}
                    name="newPassword"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <PasswordInput
                                label="Nova Senha"
                                placeholder="Insira sua nova senha"
                                value={value || ''}
                                onChange={onChange}
                            />
                            {errors.newPassword && (
                                <Text style={styles.error}>
                                    {errors.newPassword.message}
                                </Text>
                            )}
                        </>
                    )}
                />

                <Controller
                    control={control as any}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <PasswordInput
                                label="Confirmação de senha"
                                placeholder="Confirme sua senha"
                                value={value || ''}
                                onChange={onChange}
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.error}>
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </>
                    )}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(onSubmit as any)}
                >
                    {isLoading &&
                        <ActivityIndicator
                            size="small"
                            color="#ffffffff"
                            style={{ marginRight: 8 }}
                        />
                    }
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Carregando...' : 'Alterar Senha'}
                    </Text>
                </TouchableOpacity>

                <CustomModal
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    title="Senha alterada com sucesso!"
                    route='../'
                    imageSource={require('@/assets/modalImages/check.png')}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 10,
    },
    submitButton: {
        backgroundColor: '#00672e',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
