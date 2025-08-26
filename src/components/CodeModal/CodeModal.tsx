import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { PropsWithChildren, useState } from 'react';
import { useRouter, type RelativePathString } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
    route: RelativePathString;
    title?: string;
    subtitle?: string;
    onCodeSubmit?: (code: string) => void;
}>;

export default function CodeModal({
    isVisible,
    onClose,
    route,
    title = "Validação de Email",
    subtitle = "Digite o código de 6 dígitos enviado para seu email",
    onCodeSubmit,
}: Props) {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleValidateCode = async () => {
        if (code.length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Por favor, digite um código de 6 dígitos',
                position: 'top',
            });
            return;
        }

        setIsLoading(true);

        try {
            if (onCodeSubmit) {
                await onCodeSubmit(code);
            }

            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Código validado com sucesso!',
                position: 'top',
            });

            setTimeout(() => {
                onClose();
                router.push(route);
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Código inválido. Tente novamente.',
                position: 'top',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCode('');
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>

                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="mail" size={60} color="#00672e" />
                        </View>

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="000000"
                                value={code}
                                onChangeText={setCode}
                                maxLength={6}
                                textAlign="center"
                                placeholderTextColor="#999"
                                autoFocus={true}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={handleValidateCode}
                            style={[styles.validateButton, isLoading && styles.validateButtonDisabled]}
                            disabled={isLoading || code.length !== 6}
                        >
                            <Text style={styles.validateButtonText}>
                                {isLoading ? 'Validando...' : 'Validar Código'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    content: {
        padding: 24,
        paddingTop: 0,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    input: {
        borderWidth: 2,
        borderColor: '#00672e',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 8,
        backgroundColor: '#f8f9fa',
    },
    footer: {
        padding: 24,
        paddingTop: 0,
        gap: 12,
    },
    validateButton: {
        backgroundColor: '#00672e',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#00672e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    validateButtonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    validateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});
